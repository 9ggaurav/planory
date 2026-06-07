"use client"
import { useInboxTask } from "@/app/providers/inboxTaskContext";
import { useRef, useEffect } from "react";

type childProp = {
    isMoreActionsOpen: boolean;
    handleMoreActionsChange: (open: boolean) => void;
    taskId: string | null;
}

export default function MoreActions({ isMoreActionsOpen, handleMoreActionsChange, taskId }: childProp) {
    const { deleteTask, archieveTask } = useInboxTask();
    const ref = useRef<HTMLDivElement>(null);

    const handleArchieve = (id: string | null) => {
        if (!id) return;
        archieveTask(id);
        handleMoreActionsChange(false);
    }

    const handleDelete = (id: string | null) => {
        if (!id) return;
        deleteTask(id);
        handleMoreActionsChange(false);
    }

    useEffect(() => {
        if (!isMoreActionsOpen) return;
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                handleMoreActionsChange(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMoreActionsOpen]);

    if (!isMoreActionsOpen) return null;

    return (
        <div
            ref={ref}
            className="absolute left-full top-0 z-50 w-48 rounded-xl border border-neutral-200 bg-white shadow-sm py-1 overflow-hidden"
        >
            <button
                type="button"
                onClick={() => handleArchieve(taskId)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400" aria-hidden="true">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                Archive task
            </button>

            <div className="h-px bg-neutral-100 mx-2" />

            <button
                type="button"
                onClick={() => handleDelete(taskId)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-red-400" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Delete task
            </button>
        </div>
    );
}