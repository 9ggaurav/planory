"use client";
import {createContext, useContext, useState} from "react";
import type { inboxTask as inboxTaskType } from "@repo/shared";

const inboxTaskContext = createContext<{
    inboxTasks: inboxTaskType[];
    createTask: (title: string, taskListId: string) => void;
    updateTask: (id: string, updates: Partial<inboxTaskType>) => void;
    deleteTask: (id: string) => void;
    reorderTasksWithinList: (TaskListId: string, sourceIndex: number, destinationIndex: number) => void;
} | null> (null);


export function InboxTaskProvider({ children }: {children: React.ReactNode}) {
    const [inboxTasks, setInboxTasks] = useState<inboxTaskType[]>([]);
    console.log(inboxTasks)

    const nextPosition = Math.max(...inboxTasks.map(t => t.position), -1)+1;

    function createTask(title: string, taskListId: string) {
        const trimmed = title.trim()
        if (!trimmed) return

        setInboxTasks(prev => [...prev,
            {
                id: crypto.randomUUID(),
                title: trimmed,
                position: nextPosition,
                taskListId: taskListId,
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

    function reorderTasksWithinList(
        taskListId: string,
        sourceIndex: number,
        destinationIndex: number
    ) {
        setInboxTasks(prev => {
            const listTasks = prev
                .filter(task => task.taskListId === taskListId)
                .sort((a, b) => a.position - b.position);
            
            const [moved] = listTasks.splice(sourceIndex, 1);
            listTasks.splice(destinationIndex, 0, moved);
            
            const reorderedListTasks = listTasks.map((task, index) => ({
                ...task,
                position: index,
            }));

            return prev.map(task => {
                const updated = reorderedListTasks.find(
                    t => t.id === task.id
                );

                return updated ?? task;
            })
        })
    }

    function deleteTask(taskId: string) {
        setInboxTasks(prev =>
            prev.filter(task => task.id !== taskId)
            );
    }

  return (
    <inboxTaskContext.Provider value={{ inboxTasks, createTask, updateTask, deleteTask, reorderTasksWithinList }}>
        {children}
    </inboxTaskContext.Provider>
  )
}

export function useInboxTask(){
    const ctx = useContext(inboxTaskContext);    
    if (!ctx) throw new Error("useInboxTask must be used inside inboxTaskProvider");
    return ctx;
}