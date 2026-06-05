"use client"
import { useInboxTask } from "@/app/providers/inboxTaskContext";
import { useTasklist } from "@/app/providers/TasklistContext"
import AddNewTask from "@/components/sections/ProjectBoard/components/addNewTask";
import { useState, useRef } from "react";
import InboxTaskModal from "@/components/custom/EditInboxTaskModal";


export default function TaskListBoardMain() {
    const { tasklist, createTasklist } = useTasklist();
    const { createTask, inboxTasks, reorderTasksWithinList } = useInboxTask();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const dragTaskInfo = useRef<{listId: string; index: number} | null>(null)
    
    const handleDragWithinStart = (listId: string, index: number) => {
        dragTaskInfo.current = {listId, index};
    }
    
    const handleWithinDrop = (listId: string, dropIndex: number): void => {
        if (!dragTaskInfo.current) return;
        if (dragTaskInfo.current.listId !== listId) return;
        reorderTasksWithinList(listId, dragTaskInfo.current.index, dropIndex);
        dragTaskInfo.current = null
    }

    function addNewTasklist(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");

        if (typeof title !== "string") return;

        createTasklist(title);
        e.currentTarget.reset();
    }

    function handleAddTask(
        e: React.FormEvent<HTMLFormElement>,
        taskListId: string
    ) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");

        if (typeof title !== "string") return;

        createTask(title, taskListId);
        e.currentTarget.reset();
    }

    return (
        <div className="flex justify-start gap-3">
            <div
                id="tasklist-card"
                className="w-full h-full flex justify-start gap-3 px-3"
            >
                {tasklist.map((list) => (
                    <div
                        key={list.id}
                        className="min-w-75 bg-[#2D5C4F] text-neutral-50 h-full rounded-2xl pt-2 pb-1"
                    >
                        <div className="px-3">
                            <strong>{list.title}</strong>
                        </div>

                        <div>
                            <AddNewTask
                                addNewTask={(e) =>
                                    handleAddTask(e, list.id)
                                }
                            >
                                + add new Task
                            </AddNewTask>
                        </div>
                        <div>
                            {
                                inboxTasks
                                    .filter(task => task.taskListId === list.id)
                                    .sort((a, b) => a.position - b.position)
                                    .map((task, index) => (
                                        <div 
                                            onClick={() => setSelectedTaskId(task.id)}
                                            key={task.id}
                                            draggable
                                            className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer" 
                                            onDragStart={() => handleDragWithinStart(list.id, index)}
                                            onDragOver={(e)=> e.preventDefault()}
                                            onDrop={() => handleWithinDrop(list.id, index)}
                                            >
                                            {task.title}
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                ))}
                <InboxTaskModal selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />

                <div className="w-75 min-w-60">
                    <AddNewTask addNewTask={addNewTasklist}>
                        {tasklist.length === 0
                            ? "Add a list"
                            : "Add another list"}
                    </AddNewTask>
                </div>
            </div>
        </div>
    );
}