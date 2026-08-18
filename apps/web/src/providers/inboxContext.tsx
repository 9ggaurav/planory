'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/features/lib/axiosClient';
import { useTasks } from './TaskContext';
import type { inboxTask as SharedInboxTask } from '@repo/shared';

const InboxContext = createContext<{
  inboxTasklistId: number | null;
} | null>(null);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [inboxTasklistId, setInboxTasklistId] = useState<number | null>(null);
  const { setTasks } = useTasks();

  useEffect(() => {
    async function loadInbox() {
      try {
        const tlResp = await api.get('/inbox/tasklist');
        const inboxList = tlResp.data.data;
        setInboxTasklistId(inboxList.id);

        const tasksResp = await api.get(`/tasklists/${inboxList.id}/tasks`);
        const inboxTasks: SharedInboxTask[] = tasksResp.data.data;

        setTasks(prev => {
          // Drop any stale inbox entries (whether tagged 'inbox' or slipped
          // through with the real numeric id) before merging the fresh set,
          // so we don't end up with duplicates.
          const withoutInbox = prev.filter(
            t => t.taskListId !== 'inbox' && t.taskListId !== inboxList.id,
          );
          const normalized = inboxTasks.map(t => ({ ...t, taskListId: 'inbox' as const }));
          return [...withoutInbox, ...normalized];
        });
      } catch (err) {
        console.error('InboxProvider: failed to load inbox tasklist', err);
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