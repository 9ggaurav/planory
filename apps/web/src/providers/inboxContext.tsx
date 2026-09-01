'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/features/lib/axiosClient';
import { useTasks } from './TaskContext';
import type { inboxTask as SharedInboxTask } from '@repo/shared';

type LocalInboxTask = Omit<SharedInboxTask, 'taskListId' | 'id'> & {
  taskListId?: number | 'inbox';
  id: number | string;
};

const InboxContext = createContext<{
  inboxTasklistId: number | null;
} | null>(null);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [inboxTasklistId, setInboxTasklistId] = useState<number | null>(null);
  const { setTasks } = useTasks();

  useEffect(() => {
    async function loadInbox() {
      try {
        const tasksResp = await api.get(`/inbox/tasks`);
        const inboxTasks: SharedInboxTask[] = tasksResp.data.data;

        setTasks(prev => {
          // Drop any stale inbox entries (whether tagged 'inbox' or slipped
          // through with the real numeric id) before merging the fresh set,
          // so we don't end up with duplicates.
          const withoutInbox = prev.filter(
            t => t.taskListId !== 'inbox' && t.taskListId !== null,
          );
          const normalized = inboxTasks.map(t => ({ ...t, taskListId: 'inbox' as const }));
          // Keep any local inbox tasks that the fresh server snapshot doesn't
          // know about yet (e.g. one created right before this fetch resolved),
          // otherwise a stale snapshot silently deletes a just-added task.
          const serverIds = new Set<number | string>(normalized.map(t => t.id));
          const preservedLocal = prev.filter(
            t => t.taskListId === 'inbox' && !serverIds.has(t.id),
          );
          return [...withoutInbox, ...normalized, ...preservedLocal];
        });
      } catch (err) {
        console.error('InboxProvider: failed to load inbox tasks', err);
      }
    }
    loadInbox();
  }, []);

  return (
    <InboxContext.Provider value={{ inboxTasklistId }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error('useInbox must be used inside InboxProvider');
  return ctx;
}