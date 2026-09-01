'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { inboxTask as SharedInboxTask } from '@repo/shared';
import api from '@/features/lib/axiosClient';

type MaybeInbox = number | string;

type LocalInboxTask = Omit<SharedInboxTask, 'taskListId' | 'id'> & {
  taskListId?: number | 'inbox' | 'archived';
  id: number | string;
};

const TaskContext = createContext<{
  Tasks: LocalInboxTask[];
  setTasks: React.Dispatch<React.SetStateAction<LocalInboxTask[]>>;
  createTask: (title: string, taskListId: MaybeInbox) => Promise<void>;
  updateTask: (id: number | string, updates: Partial<SharedInboxTask>) => Promise<void>;
  deleteTask: (id: number | string) => Promise<void>;
  reorderTasksWithinList: (
    taskListId: MaybeInbox,
    sourceIndex: number,
    destinationIndex: number,
  ) => Promise<void>;
  moveTaskToList: (
    taskId: number | string,
    targetListId: MaybeInbox,
    destinationIndex?: number,
  ) => Promise<void>;
  deleteTasksByTasklistId: (tasklistId: MaybeInbox) => void;
  archieveTask: (taskId: number | string) => Promise<void>;
} | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [Tasks, setTasks] = useState<LocalInboxTask[]>([]);

  function getNewPosition(sortedTasks: LocalInboxTask[], destinationIndex: number) {
    const prev = sortedTasks[destinationIndex - 1];
    const next = sortedTasks[destinationIndex + 1];

    if (!prev && !next) return 1000;
    if (!prev) return next.position > 0 ? next.position / 2 : next.position - 1000;
    if (!next) return prev.position + 1000;
    return (prev.position + next.position) / 2;
  }

  async function createTask(title: string, taskListId: MaybeInbox) {
    const trimmed = title.trim();
    if (!trimmed) return;

    // Persist inbox tasks on the server
    if (taskListId === 'inbox') {
      try {
        const resp = await api.post(`/inbox/tasks`, { title: trimmed });
        const created: SharedInboxTask = resp.data.data;
        setTasks(prev => [
          ...prev,
          { ...created, taskListId: 'inbox' } as unknown as LocalInboxTask, // ← normalize
        ]);
        return;
      } catch (err) {
        console.error('createTask (inbox) error', err);
        throw err;
      }
    }

    try {
      const resp = await api.post(`/tasklists/${taskListId}/tasks`, { title: trimmed });
      const created: SharedInboxTask = resp.data.data;
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('createTask error', err);
      throw err;
    }
  }

  async function updateTask(id: number | string, updates: Partial<SharedInboxTask>) {
    if (typeof id === 'number') {
      try {
        const resp = await api.patch(`/tasks/${id}`, updates);
        const updated = resp.data.data;
        setTasks(prev => prev.map(t => (t.id === id ? { ...updated, taskListId: t.taskListId === 'inbox' ? 'inbox' : updated.taskListId } as unknown as LocalInboxTask : t)));
        return;
      } catch (err) {
        console.error('updateTask error', err);
        throw err;
      }
    }

    // local-only id shouldn't normally exist anymore; keep state update as fallback
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }

  async function deleteTask(id: number | string) {
    if (typeof id === 'number') {
      try {
        await api.delete(`/tasks/${id}`);
      } catch (err) {
        console.error('deleteTask error', err);
        throw err;
      }
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function reorderTasksWithinList(
    taskListId: MaybeInbox,
    sourceIndex: number,
    destinationIndex: number,
  ) {
    // compute new position among tasks in that list
    const listTasks = Tasks.filter(t => (taskListId === 'inbox' ? t.taskListId === 'inbox' : Number(t.taskListId) === Number(taskListId))).sort(
      (a, b) => a.position - b.position,
    );
    const moved = listTasks[sourceIndex];
    if (!moved) return;

    const reordered = [...listTasks];
    reordered.splice(sourceIndex, 1);
    const clampedDest = Math.max(0, Math.min(destinationIndex, reordered.length));
    reordered.splice(clampedDest, 0, moved);

    const newPosition = getNewPosition(reordered, clampedDest);

    if (typeof moved.id === 'number') {
      try {
        const resp = await api.patch(`/tasks/${moved.id}/move`, { position: newPosition });
        const updated: SharedInboxTask = resp.data.data;
        setTasks(prev => prev.map(t => (t.id === moved.id ? { ...updated, taskListId: taskListId === 'inbox' ? 'inbox' : (updated.taskListId ?? Number(taskListId)) } as unknown as LocalInboxTask : t)));
        return;
      } catch (err) {
        console.error('reorderTasksWithinList error', err);
        throw err;
      }
    }

    // local-only update for non-numeric ids
    setTasks(prev => prev.map(t => (t.id === moved.id ? { ...t, position: newPosition } : t)));
  }

  async function moveTaskToList(
    taskId: number | string,
    targetListId: MaybeInbox,
    destinationIndex?: number,
  ) {
    const task = Tasks.find(t => t.id === taskId);
    if (!task) return;

    const targetTasks = Tasks.filter(t =>
      t.id !== taskId && (targetListId === 'inbox' ? t.taskListId === 'inbox' : Number(t.taskListId) === Number(targetListId))
    ).sort((a, b) => a.position - b.position);

    const dropIndex = destinationIndex !== undefined ? Math.max(0, Math.min(destinationIndex, targetTasks.length)) : targetTasks.length;
    const withInserted = [...targetTasks];
    withInserted.splice(dropIndex, 0, task);

    const newPosition = getNewPosition(withInserted, dropIndex);

    // Moving a task that already exists in the DB
    if (typeof taskId === 'number') {
      try {
        const payload: any = { position: newPosition };
        if (targetListId === 'inbox') {
          payload.tasklistId = null;
        } else {
          payload.tasklistId = Number(targetListId);
        }

        const resp = await api.patch(`/tasks/${taskId}/move`, payload);
        const updated: SharedInboxTask = resp.data.data;
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId
              ? ({ ...updated, taskListId: targetListId === 'inbox' ? 'inbox' : (updated.taskListId ?? Number(targetListId)) } as unknown as LocalInboxTask)
              : t
          )
        );
        return;
      } catch (err) {
        console.error('moveTaskToList error', err);
        throw err;
      }
    }

    // If task is non-numeric (fallback), create in the target list
    if (typeof taskId !== 'number') {
      try {
        let createResp;
        if (targetListId === 'inbox') {
          createResp = await api.post(`/inbox/tasks`, { title: task.title });
        } else {
          createResp = await api.post(`/tasklists/${targetListId}/tasks`, { title: task.title });
        }
        
        const created: SharedInboxTask = createResp.data.data;
        if (dropIndex < targetTasks.length) {
          await api.patch(`/tasks/${created.id}/move`, { position: newPosition });
          created.position = newPosition;
        }
        setTasks(prev =>
          prev.map(t => (t.id === taskId ? ({ ...created, taskListId: targetListId === 'inbox' ? 'inbox' : created.taskListId } as unknown as LocalInboxTask) : t)),
        );
        return;
      } catch (err) {
        console.error('moveTaskToList create-from-nonnum error', err);
        throw err;
      }
    }

    // Fallback: update local state
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, taskListId: targetListId as number | 'inbox', position: newPosition } : t,
      ),
    );
  }

  function deleteTasksByTasklistId(tasklistId: MaybeInbox) {
    setTasks(prev => prev.filter(t => t.taskListId !== tasklistId));
  }

  async function archieveTask(taskId: number | string) {
    if (typeof taskId === 'number') {
      try {
        await api.patch(`/tasks/${taskId}`, { isArchived: true });
      } catch (err) {
        console.error('archieveTask error', err);
        throw err;
      }
    }
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, taskListId: 'archived' } : t)));
  }

  return (
    <TaskContext.Provider
      value={{
        Tasks,
        setTasks,
        createTask,
        updateTask,
        deleteTask,
        reorderTasksWithinList,
        moveTaskToList,
        deleteTasksByTasklistId,
        archieveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
}
