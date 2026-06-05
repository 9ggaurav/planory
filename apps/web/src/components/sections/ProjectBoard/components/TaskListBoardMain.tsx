"use client"
import { useInboxTask } from "@/app/providers/inboxTaskContext";
import { useTasklist } from "@/app/providers/TasklistContext"
import AddNewTask from "@/components/sections/ProjectBoard/components/addNewTask";
import { useState } from "react";
import InboxTaskModal from "@/components/custom/EditInboxTaskModal";
import { useParams } from "next/navigation";
// import { useDragAndDrop } from "@/app/providers/useDragAndDrop";
import { useDnD } from "@/app/providers/DragAndDropContext";


export default function TaskListBoardMain() {
    const { tasklist, createTasklist } = useTasklist();
    const { createTask, inboxTasks } = useInboxTask();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const boardid = useParams().boardid as string;
    const { dragTaskInfo, handleTaskDragStart, handleTaskDrop, handleContainerDrop, handleListDragStart } = useDnD();

    // ── Form handlers ───────────────────────────────────────────────────────

    function addNewTasklist(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        if (typeof title !== "string") return;
        createTasklist(title);
        e.currentTarget.reset();
    }

    function handleAddTask(e: React.FormEvent<HTMLFormElement>, taskListId: string) {
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
                    .map((list, listIndex) => (
                        <div
                            key={list.id}
                            className="min-w-75 bg-[#2D5C4F] text-neutral-50 h-full rounded-2xl pt-2 pb-1"
                            draggable
                            onDragStart={(e) => {
                                // Only start list drag if no task drag is in progress
                                if (dragTaskInfo.current) return;
                                handleListDragStart(boardid, listIndex);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleContainerDrop(list.id, boardid,  listIndex)
                            }}
                        >
                            <div className="px-3">
                                <strong>{list.title}</strong>
                            </div>

                            <div>
                                <AddNewTask addNewTask={(e) => handleAddTask(e, list.id)}>
                                    + add new Task
                                </AddNewTask>
                            </div>

                            <div>
                                {inboxTasks
                                    .filter(task => task.taskListId === list.id)
                                    .sort((a, b) => a.position - b.position)
                                    .map((task, taskIndex) => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onClick={() => setSelectedTaskId(task.id)}
                                            onDragStart={(e) => {
                                                e.stopPropagation(); // prevent list drag from firing
                                                handleTaskDragStart(list.id, taskIndex, task.id);
                                            }}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.stopPropagation(); 
                                                handleTaskDrop(list.id, taskIndex);
                                            }}
                                            className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer"
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

                <InboxTaskModal selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />

                <div className="w-75 min-w-60">
                    <AddNewTask addNewTask={addNewTasklist}>
                        {tasklist.length === 0 ? "Add a list" : "Add another list"}
                    </AddNewTask>
                </div>
            </div>
        </div>
    );
}