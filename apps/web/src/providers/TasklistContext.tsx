'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Tasklist as TasklistType } from '@repo/shared';
import { useParams } from 'next/navigation';
// import { taskLists as defaultTasklists } from "@/lib/mockData";
import api from '../lib/axiosClient';

const tasklistContext = createContext<{
  tasklist: TasklistType[];
  createTasklist: (tasklist: TasklistType) => void;
  setTasklist: React.Dispatch<React.SetStateAction<TasklistType[]>>;
  updateTasklist: (id: string, updates: Partial<TasklistType>) => void;
  deleteTasklist: (id: string) => void;
  reorderListsWithinBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
} | null>(null);

export function TasklistProvider({ children }: { children: React.ReactNode }) {
  const [tasklist, setTasklist] = useState<TasklistType[]>([]);
  const boardid = useParams().boardid as string;

  const fetchTasklists = async () => {
    const response = await api.get(`boards/${boardid}/tasklists`);
    setTasklist(response.data.data);
  };

  useEffect(() => {
    async function load() {
      await Promise.all([fetchTasklists()]);
    }
    load();
  }, []);

//   console.log('tasklists: ', tasklist);

  const nextPosition = Math.max(...tasklist.map(t => t.position), -1) + 1;

  function createTasklist(tasklist: TasklistType) {
    setTasklist(prev => [...prev, tasklist])
  }

  function updateTasklist(id: string, updates: Partial<TasklistType>) {
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

  function reorderListsWithinBoard(boardId: string, sourceIndex: number, destinationIndex: number) {
    setTasklist(prev => {
      const boardLists = prev
        .filter(list => list.boardId === boardId)
        .sort((a, b) => a.position - b.position);

      const [moved] = boardLists.splice(sourceIndex, 1);
      boardLists.splice(destinationIndex, 0, moved);

      const reorderedLists = boardLists.map((list, index) => ({
        ...list,
        position: index,
      }));

      return prev.map(list => {
        const updated = reorderedLists.find(l => l.id === list.id);

        return updated ?? list;
      });
    });
  }

  function deleteTasklist(taskId: string) {
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
