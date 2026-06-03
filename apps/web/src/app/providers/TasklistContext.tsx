"use client"
import {createContext, useContext, useState} from "react";
import type {Tasklist as TasklistType} from "@repo/shared";

// type Tasklist = {
//     id: string;
//     title: string;
//     position: number;
//     description: string;
//     isArchieved: boolean;
//     boardId: string;
//     createdAt: string;
//     updatedAt: string;
// }

const tasklistContext = createContext<{
    tasklist: TasklistType[];
    createTasklist: (title: string) => void;
    setTasklist: React.Dispatch<React.SetStateAction<TasklistType[]>>;
    updateTasklist: (id: string, updates: Partial<TasklistType>) => void;
    deleteTasklist: (id: string) => void;
} | null> (null);

export function TasklistProvider({children}: {children: React.ReactNode}) {
    const [tasklist, setTasklist] = useState<TasklistType[]>([
    ]);

    const nextPosition = Math.max(...tasklist.map(t => t.position), -1)+1;

    function createTasklist(title: string) {
        const trimmed = title.trim()
        if (!trimmed) return
        setTasklist(prev => [...prev,
            {
                id: crypto.randomUUID(),
                title: title,
                position: nextPosition,
                description: '',
                isArchieved: false,
                boardId: '123',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ])
    }

    function updateTasklist(id: string, updates: Partial<TasklistType>) {
        setTasklist((prev) => 
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
    
    function deleteTasklist(taskId: string) {
        setTasklist(prev => 
            prev.filter(task => task.id !== taskId)
        )
    }

    return (
        <tasklistContext.Provider value={{tasklist, setTasklist, createTasklist, updateTasklist, deleteTasklist}}>
            {children}
        </tasklistContext.Provider>
    )
}

export function useTasklist() {
    const ctx = useContext(tasklistContext);
    if (!ctx) throw new Error("useTasklist must be used inside TasklistProvider");
    return ctx;
}