"use client";
import {createContext, useContext, useState} from "react";
import type { inboxTask, inboxTask as inboxTaskType } from "@repo/shared";

const inboxTaskContext = createContext<{
    inboxTasks: inboxTaskType[];
    handleInboxTaskSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
} | null> (null);


export function InboxTaskProvider({ children }: {children: React.ReactNode}) {
    const [inboxTasks, setInboxTasks] = useState<inboxTaskType[]>([]);
    
    function handleInboxTaskSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const taskTitle = formData.get("new-task") as string;

            if (typeof taskTitle != "string" || !taskTitle.trim() ){
                return;
            }


            const newTask: inboxTask = {
                id: crypto.randomUUID(),
                title: taskTitle,
            }

            setInboxTasks(prev => [...prev, newTask]);

            e.currentTarget.reset();
        }

  return (
    <inboxTaskContext.Provider value={{ inboxTasks, handleInboxTaskSubmit }}>
        {children}
    </inboxTaskContext.Provider>
  )
}

export function useInboxTask(){
    const ctx = useContext(inboxTaskContext);    
    if (!ctx) throw new Error("useInboxTask must be used inside inboxTaskProvider");
    return ctx;
}