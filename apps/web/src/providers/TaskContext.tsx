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
    const next = sortedTasks[destinationIndex];

    if (!prev && !next) return 1000;
    if (!prev) return next.position / 2;
    if (!next) return prev.position + 1000;
    return (prev.position + next.position) / 2;
  }

  async function createTask(title: string, taskListId: MaybeInbox) {
    const trimmed = title.trim();
    if (!trimmed) return;

    // Persist inbox tasks on the server: fetch/create inbox tasklist then create task there
    if (taskListId === 'inbox') {
      try {
        const tlResp = await api.get(`/inbox/tasklist`);
        const inboxList = tlResp.data.data;
        const resp = await api.post(`/tasklists/${inboxList.id}/tasks`, { title: trimmed });
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
        setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
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
    const listTasks = Tasks.filter(t => t.taskListId === taskListId).sort(
      (a, b) => a.position - b.position,
    );
    const moved = listTasks[sourceIndex];
    if (!moved) return;

    const reordered = [...listTasks];
    reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    const newPosition = getNewPosition(reordered, destinationIndex);

    if (taskListId !== 'inbox' && typeof moved.id === 'number') {
      try {
        const resp = await api.patch(`/tasks/${moved.id}/move`, { position: newPosition });
        const updated: SharedInboxTask = resp.data.data;
        setTasks(prev => prev.map(t => (t.id === moved.id ? updated : t)));
        return;
      } catch (err) {
        console.error('reorderTasksWithinList error', err);
        throw err;
      }
    }

    // local-only update for inbox or non-numeric ids
    setTasks(prev => prev.map(t => (t.id === moved.id ? { ...t, position: newPosition } : t)));
  }

  async function moveTaskToList(
    taskId: number | string,
    targetListId: MaybeInbox,
    destinationIndex?: number,
  ) {
    const task = Tasks.find(t => t.id === taskId);
    if (!task) return;

    const targetTasks = Tasks.filter(t => t.taskListId === targetListId).sort(
      (a, b) => a.position - b.position,
    );
    const dropIndex = destinationIndex !== undefined ? destinationIndex : targetTasks.length;
    const withInserted = [...targetTasks];
    withInserted.splice(dropIndex, 0, task);

    const newPosition = getNewPosition(withInserted, dropIndex);

    // Moving a task that already exists in the DB
    if (targetListId !== 'inbox' && typeof taskId === 'number') {
      try {
        const resp = await api.patch(`/tasks/${taskId}/move`, {
          position: newPosition,
          tasklistId: targetListId,
        });
        const updated: SharedInboxTask = resp.data.data;
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
        return;
      } catch (err) {
        console.error('moveTaskToList error', err);
        throw err;
      }
    }

    // If task exists in DB (numeric id)
    if (typeof taskId === 'number') {
      // moving into inbox: move into the user's inbox tasklist
      // if (targetListId === 'inbox') {
      //   try {
      //     const tlResp = await api.get(`/inbox/tasklist`);
      //     const inboxList = tlResp.data.data;
      //     const resp = await api.patch(`/tasks/${taskId}/move`, {
      //       position: newPosition,
      //       tasklistId: inboxList.id,
      //     });
      //     const updated: SharedInboxTask = resp.data.data;
      //     setTasks(
      //       prev => prev.map(t => (t.id === taskId ? { ...updated, taskListId: 'inbox' } : t)), // ← normalize
      //     );
      //     return;
      //   } catch (err) {
      //     console.error('moveTaskToList -> inbox error', err);
      //     throw err;
      //   }
      // }
      if (targetListId === 'inbox') {
        try {
          const tlResp = await api.get(`/inbox/tasklist`);
          const inboxList = tlResp.data.data;
          const resp = await api.patch(`/tasks/${taskId}/move`, {
            position: newPosition,
            tasklistId: inboxList.id,
          });
          const updated: SharedInboxTask = resp.data.data;
          setTasks(prev =>
            prev.map(t => (t.id === taskId ? { ...updated, taskListId: 'inbox' } : t)),
          );
          return;
        } catch (err) {
          console.error('moveTaskToList -> inbox error', err);
          throw err;
        }
      }

      // moving between DB lists
      try {
        const resp = await api.patch(`/tasks/${taskId}/move`, {
          position: newPosition,
          tasklistId: targetListId,
        });
        const updated: SharedInboxTask = resp.data.data;
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
        return;
      } catch (err) {
        console.error('moveTaskToList error', err);
        throw err;
      }
    }

    // If task is non-numeric (fallback), create in the target list
    if (typeof taskId !== 'number' && typeof targetListId === 'number') {
      try {
        const createResp = await api.post(`/tasklists/${targetListId}/tasks`, {
          title: task.title,
        });
        const created: SharedInboxTask = createResp.data.data;
        if (dropIndex < targetTasks.length) {
          await api.patch(`/tasks/${created.id}/move`, { position: newPosition });
          created.position = newPosition;
        }
        setTasks(prev =>
          prev.map(t => (t.id === taskId ? (created as unknown as LocalInboxTask) : t)),
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
        t.id === taskId ? { ...t, taskListId: targetListId as number, position: newPosition } : t,
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
