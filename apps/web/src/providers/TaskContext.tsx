"use client";
import {createContext, useContext, useState} from "react";
import type { inboxTask as inboxTaskType } from "@repo/shared";
import {tasks as defaultTasks} from "@/lib/mockData"

const TaskContext = createContext<{
    Tasks: inboxTaskType[];
    createTask: (title: string, taskListId: string) => void;
    updateTask: (id: string, updates: Partial<inboxTaskType>) => void;
    deleteTask: (id: string) => void;
    reorderTasksWithinList: (TaskListId: string, sourceIndex: number, destinationIndex: number) => void;
    moveTaskToList: (taskId: string, targetListId: string) => void;
    archieveTask: (taskId: string) => void;
    deleteTasksByTasklistId: (tasklistId: string) => void;
} | null> (null);


export function TaskProvider({ children }: {children: React.ReactNode}) {
    const [Tasks, setTasks] = useState<inboxTaskType[]>([...defaultTasks]);

    function createTask(title: string, taskListId: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    setTasks(prev => {
        const nextPosition = Math.max(...prev.map(t => t.position), -1) + 1; // ✅ inside updater
        return [...prev, {
            id: crypto.randomUUID(),
            title: trimmed,
            position: nextPosition,
            taskListId,
            description: '',
            isDone: false,
            createdAt: new Date().toISOString()
        }];
    });
    }

    function updateTask(id: string, updates: Partial<inboxTaskType>) {
        setTasks((prev) => 
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
        setTasks(prev => {
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

    function moveTaskToList(taskId: string, targetListId: string) {
        setTasks(prev => {
            const targetListTasks = prev.filter(t => t.taskListId === targetListId)
            const nextPosition = Math.max(...targetListTasks.map(t => t.position), -1)+1;
            return prev.map(task => 
                task.id === taskId
                    ? { ...task, taskListId: targetListId, position: nextPosition}
                    : task
            )
        })
    }

    function deleteTask(taskId: string) {
        setTasks(prev =>
            prev.filter(task => task.id !== taskId)
            );
    }

    function deleteTasksByTasklistId(tasklistId: string) {
        setTasks(prev => 
            prev.filter(task => task.taskListId !== tasklistId )
        )
    }

    function archieveTask(taskId: string) {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    return {...task, taskListId: "archieve"}
                }
                return task;
            })
        )
    }

  return (
    <TaskContext.Provider value={{ Tasks, createTask, updateTask, deleteTask, reorderTasksWithinList, moveTaskToList, archieveTask, deleteTasksByTasklistId }}>
        {children}
    </TaskContext.Provider>
  )
}

export function useTasks(){
    const ctx = useContext(TaskContext);    
    if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
    return ctx;
}