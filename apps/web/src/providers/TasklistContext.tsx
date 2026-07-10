"use client"
import {createContext, useContext, useState} from "react";
import type {Tasklist as TasklistType} from "@repo/shared";
import { useParams } from "next/navigation";
import { taskLists as defaultTasklists } from "@/lib/mockData";

const tasklistContext = createContext<{
    tasklist: TasklistType[];
    createTasklist: (title: string) => void;
    setTasklist: React.Dispatch<React.SetStateAction<TasklistType[]>>;
    updateTasklist: (id: string, updates: Partial<TasklistType>) => void;
    deleteTasklist: (id: string) => void;
    reorderListsWithinBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
} | null> (null);

export function TasklistProvider({children}: {children: React.ReactNode}) {
    const [tasklist, setTasklist] = useState<TasklistType[]>([...defaultTasklists]);
    const boardid = useParams().boardid as string;

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
                boardId: boardid,
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

    function reorderListsWithinBoard(
        boardId: string,
        sourceIndex: number,
        destinationIndex: number
    ) {
        setTasklist(prev => {
            const boardLists = prev
                .filter(list => list.boardId === boardId)
                .sort((a, b) => a.position - b.position)

            const [moved] = boardLists.splice(sourceIndex, 1);
            boardLists.splice(destinationIndex, 0, moved);

            const reorderedLists = boardLists.map((list, index) => ({
                ...list,
                position: index
            }))

            return prev.map(list => {
                const updated = reorderedLists.find(
                    l => l.id === list.id
                );

                return updated ?? list;
            })
        })
    }
    
    function deleteTasklist(taskId: string) {
        setTasklist(prev => 
            prev.filter(task => task.id !== taskId)
        )

    }

    return (
        <tasklistContext.Provider value={{tasklist, setTasklist, createTasklist, updateTasklist, deleteTasklist, reorderListsWithinBoard}}>
            {children}
        </tasklistContext.Provider>
    )
}

export function useTasklist() {
    const ctx = useContext(tasklistContext);
    if (!ctx) throw new Error("useTasklist must be used inside TasklistProvider");
    return ctx;
}