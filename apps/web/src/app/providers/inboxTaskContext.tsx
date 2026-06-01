"use client";
import {createContext, useContext, useState} from "react";
import type { inboxTask as inboxTaskType } from "@repo/shared";

const inboxTaskContext = createContext<{
    inboxTasks: inboxTaskType[];
    createTask: (title: string) => void;
    updateTask: (id: string, updates: Partial<inboxTaskType>) => void;
    deleteTask: (id: string) => void;
} | null> (null);


export function InboxTaskProvider({ children }: {children: React.ReactNode}) {
    const [inboxTasks, setInboxTasks] = useState<inboxTaskType[]>([]);
    console.log(inboxTasks)

    function createTask(title: string) {
        const trimmed = title.trim()
        if (!trimmed) return
        setInboxTasks(prev => [...prev,
            {
                id: crypto.randomUUID(),
                title: trimmed,
                position: inboxTasks.length,
                description: '',
                isDone: false,
                createdAt: new Date().toISOString()
                
            }]
        )
    }

    function updateTask(id: string, updates: Partial<inboxTaskType>) {
        setInboxTasks((prev) => 
            prev.map((task) => 
                task.id === id
                    ? {
                        ...task,
                        ...updates,
                    }
                    : task
            )
        )
    }

    function deleteTask(taskId: string) {
        setInboxTasks(prev =>
            prev.filter(task => task.id !== taskId)
            );
    }

  return (
    <inboxTaskContext.Provider value={{ inboxTasks, createTask, updateTask, deleteTask }}>
        {children}
    </inboxTaskContext.Provider>
  )
}

export function useInboxTask(){
    const ctx = useContext(inboxTaskContext);    
    if (!ctx) throw new Error("useInboxTask must be used inside inboxTaskProvider");
    return ctx;
}