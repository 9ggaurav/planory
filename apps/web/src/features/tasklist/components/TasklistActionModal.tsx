'use client';
import { useTasks } from '@/providers/TaskContext';
import { useTasklist } from '@/providers/TasklistContext';
import { useRef, useEffect } from 'react';

type childProp = {
  isMoreActionsOpen: boolean;
  handleMoreActionChange: (open: boolean) => void;
  listId: string | number | null;
  setIsTasklistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: { top: number; left: number };
};

export default function TasklistMoreActions({
  isMoreActionsOpen,
  handleMoreActionChange,
  listId,
  setIsTasklistModalOpen,
  position,
}: childProp) {
  const { deleteTasksByTasklistId } = useTasks();
  const { deleteTasklist } = useTasklist();
  const ref = useRef<HTMLDivElement>(null);

  const handleDeleteListCascade = (listId: string | number) => {
    if (!listId) return;
    deleteTasklist(listId);
    deleteTasksByTasklistId(listId);
    setIsTasklistModalOpen(false);
  };

  useEffect(() => {
    if (!isMoreActionsOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleMoreActionChange(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreActionsOpen]);

  if (!isMoreActionsOpen) return null;

  return (
    <div
      ref={ref}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="absolute right-10 top-8 z-50 w-48 rounded-xl border border-neutral-200 bg-white shadow-sm py-1 overflow-hidden"
    >
      <div className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-red-50 transition-colors text-left">
        More Actions
      </div>
      <button
        type="button"
        onClick={() => listId && handleDeleteListCascade(listId)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-400"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
        Delete task
      </button>
    </div>
  );
}
