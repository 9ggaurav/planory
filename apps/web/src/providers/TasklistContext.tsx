'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Tasklist as TasklistType } from '@repo/shared';
import { useParams } from 'next/navigation';
import api from '@/features/lib/axiosClient';
import { useTasks } from './TaskContext';

const tasklistContext = createContext<{
  tasklist: TasklistType[];
  createTasklist: (tasklist: TasklistType) => void;
  setTasklist: React.Dispatch<React.SetStateAction<TasklistType[]>>;
  updateTasklist: (id: string | number, updates: Partial<TasklistType>) => void;
  deleteTasklist: (id: string | number) => void;
  reorderListsWithinBoard: (boardId: number, sourceIndex: number, destinationIndex: number) => void;
} | null>(null);

export function TasklistProvider({ children }: { children: React.ReactNode }) {
  const [tasklist, setTasklist] = useState<TasklistType[]>([]);
  const bid = useParams().boardid;
  const boardid = bid ? Number(bid) : 0;

  const { setTasks } = useTasks();

  const fetchTasklists = async () => {
    const response = await api.get(`boards/${boardid}/tasklists`);
    const lists = response.data.data;
    setTasklist(lists);
    
    // Extract nested tasks from the tasklists response
    const allTasks = lists.flatMap((list: any) => list.tasks || []);
    setTasks(prev => {
      // preserve any local-only inbox tasks (they use a string id 'inbox')
      const inboxTasks = (prev as any[]).filter((t) => t.taskListId === 'inbox');
      return [...inboxTasks, ...allTasks];
    });
  };

  useEffect(() => {
    async function load() {
      await Promise.all([fetchTasklists()]);
    }
    load();
  }, []);


  // Helper Functions
  function getNewPosition(lists: TasklistType[], destinationIndex: number) {
    const prev = lists[destinationIndex - 1];
    const next = lists[destinationIndex + 1];

    if (!prev && !next) {
      return 1000;
    }

    if (!prev) {
      return next.position - 1000;
    }

    if (!next) {
      return prev.position + 1000;
    }

    return (prev.position + next.position) / 2;
  }

  function createTasklist(tasklist: TasklistType) {
    setTasklist(prev => [...prev, tasklist]);
  }

  function updateTasklist(id: string | number, updates: Partial<TasklistType>) {
    if (typeof id === 'number') {
      api.patch(`/tasklists/${id}`, updates).catch(err => console.error(err));
    }
    setTasklist(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task,
      ),
    );
  }

  function reorderListsWithinBoard(boardId: number, sourceIndex: number, destinationIndex: number) {
    setTasklist(prev => {
      const boardLists = prev
        .filter(list => Number(list.boardId) === boardId)
        .sort((a, b) => a.position - b.position);

      const [moved] = boardLists.splice(sourceIndex, 1);

      boardLists.splice(destinationIndex, 0, moved);

      const newPosition = getNewPosition(boardLists, destinationIndex);

      api.patch(`/tasklists/${moved.id}/move`, { position: newPosition, boardId: boardId }).catch(err => {
        console.error('Error updating tasklist position:', err);
      });

      return prev.map(list => (list.id === moved.id ? { ...list, position: newPosition } : list));
    });
  }

  function deleteTasklist(taskId: string | number) {
    if (typeof taskId === 'number') {
      api.delete(`/tasklists/${taskId}`).catch(err => console.error(err));
    }
    setTasklist(prev => prev.filter(task => task.id !== taskId));
  }

  return (
    <tasklistContext.Provider
      value={{
        tasklist,
        setTasklist,
        createTasklist,
        updateTasklist,
        deleteTasklist,
        reorderListsWithinBoard,
      }}
    >
      {children}
    </tasklistContext.Provider>
  );
}

export function useTasklist() {
  const ctx = useContext(tasklistContext);
  if (!ctx) throw new Error('useTasklist must be used inside TasklistProvider');
  return ctx;
}
