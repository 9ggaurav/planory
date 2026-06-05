"use client"
import { useInboxTask } from "@/app/providers/inboxTaskContext";
import { useTasklist } from "@/app/providers/TasklistContext"
import AddNewTask from "@/components/sections/ProjectBoard/components/addNewTask";
import { useState, useRef } from "react";
import InboxTaskModal from "@/components/custom/EditInboxTaskModal";
import { useParams } from "next/navigation";


export default function TaskListBoardMain() {
    const { tasklist, createTasklist, reorderListsWithinBoard } = useTasklist();
    const { createTask, inboxTasks, reorderTasksWithinList } = useInboxTask();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const dragTaskInfo = useRef<{listId: string; index: number} | null>(null)
    const dragListInfo = useRef<{boardId: string; index: number} | null>(null);
    const boardid = useParams().boardid as string;
    
    const handleDragWithinStart = (listId: string, index: number) => {
        dragTaskInfo.current = {listId, index};
    }

    const handleDragWithinStartTasklist = (boardId: string, index: number) => {
        dragListInfo.current = {boardId, index}
    }
    
    const handleWithinDrop = (listId: string, dropIndex: number): void => {
        if (!dragTaskInfo.current) return;
        if (dragTaskInfo.current.listId !== listId) return;
        reorderTasksWithinList(listId, dragTaskInfo.current.index, dropIndex);
        dragTaskInfo.current = null
    }

    const handleWithinDropTasklist = (boardId: string, dropIndex: number): void => {
        if (!dragListInfo.current) return
        if (dragListInfo.current.boardId !== boardId) return;
        reorderListsWithinBoard(boardId, dragListInfo.current.index, dropIndex);
        dragListInfo.current = null
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
                {tasklist
                    .filter(list => list.boardId === boardid)
                    .sort((a, b) => a.position - b.position)
                    .map((list, index) => (
                    <div
                        key={list.id}
                        className="min-w-75 bg-[#2D5C4F] text-neutral-50 h-full rounded-2xl pt-2 pb-1"
                        draggable
                        onDragStart = {() => handleDragWithinStartTasklist(boardid, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop = {() => handleWithinDropTasklist(boardid, index)}
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