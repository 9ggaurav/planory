"use client"
import { useInboxTask } from "@/app/providers/inboxTaskContext";
import { useTasklist } from "@/app/providers/TasklistContext"
import AddNewTask from "@/components/sections/ProjectBoard/components/addNewTask";
import { useState } from "react";
import InboxTaskModal from "@/components/custom/EditInboxTaskModal";
import { useParams } from "next/navigation";
import { useDnD } from "@/app/providers/DragAndDropContext";
import TasklistMoreActions from "./TasklistActionModal";
import { useRef } from "react";


export default function TaskListBoardMain() {
    const { tasklist, createTasklist } = useTasklist();
    const { createTask, inboxTasks } = useInboxTask();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isTasklistModalOpen, setIsTasklistModalOpen] = useState<boolean>(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const listMenuRef = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [modalPosition, setModalPosition] = useState<{top: number; left: number }>({top: 0, left: 0});

    const handleMoreActionsChange = (open: boolean) => {
        setIsTasklistModalOpen(open);
    }

    const boardid = useParams().boardid as string;
    const { dragTaskInfo, handleTaskDragStart, handleTaskDrop, handleContainerDrop, handleListDragStart } = useDnD();

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

    const filteredLists = tasklist
        .filter(list => list.boardId === boardid)
        .sort((a, b) => a.position - b.position);

    return (
        <div className="flex justify-start gap-3 h-full px-4 py-4 overflow-x-auto">

            {filteredLists.map((list, listIndex) => {
                const listTasks = inboxTasks
                    .filter(task => task.taskListId === list.id)
                    .sort((a, b) => a.position - b.position);

                const doneCount = listTasks.filter(t => t.isDone).length;

                return (
                    <div
                        key={list.id}
                        className="relative shrink-0 w-68 flex flex-col rounded-2xl bg-[#f5f5f3] border border-neutral-200/80 max-h-full"
                        draggable
                        onDragStart={() => {
                            if (dragTaskInfo.current) return;
                            handleListDragStart(boardid, listIndex);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleContainerDrop(list.id, boardid, listIndex);
                        }}
                    >
                        {/* Column header */}
                        <div className="px-3.5 pt-3.5 pb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-[13px] text-neutral-800 truncate tracking-[-0.01em]">
                                    {list.title}
                                </span>
                                {listTasks.length > 0 && (
                                    <span className="text-[11px] font-medium text-neutral-400 bg-neutral-200/70 px-1.5 py-0.5 rounded-full shrink-0">
                                        {doneCount}/{listTasks.length}
                                    </span>
                                )}
                            </div>
                            <button
                                className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/60 transition-colors shrink-0"
                                aria-label="List options"
                                ref = {(el) => {if (el) listMenuRef.current.set(list.id, el)}}
                                onClick={(e) => {
                                    e.stopPropagation()

                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setModalPosition({
                                        top: rect.bottom + window.scrollY - 24,
                                        left: rect.left + window.scrollX + 40
                                    })

                                    setIsTasklistModalOpen(true)
                                    setSelectedListId(list.id)
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                                </svg>
                            </button>
                        </div>

                        {/* Add task — sits right below header */}
                        <div className="px-2 pb-1">
                            <AddNewTask addNewTask={(e) => handleAddTask(e, list.id)}>
                                <span className="flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                                    Add task
                                </span>
                            </AddNewTask>
                        </div>

                        {/* Task cards */}
                        <div className="flex flex-col gap-1.5 px-2 pb-2.5 overflow-y-auto flex-1">
                            {listTasks.map((task, taskIndex) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onClick={(e) => {
                                        setSelectedTaskId(task.id)
                                        // const rect = e.currentTarget.getBoundingClientRect();
                                        setModalPosition({
                                            // top: rect.bottom + window.scrollY - 24,
                                            // left: rect.left + window.scrollX + 500,
                                            top: 200,
                                            left: 1000
                                        })
                                    }}
                                    onDragStart={(e) => {
                                        e.stopPropagation();
                                        handleTaskDragStart(list.id, taskIndex, task.id);
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.stopPropagation();
                                        handleTaskDrop(list.id, taskIndex);
                                    }}
                                    className={`
                                        group relative bg-white rounded-xl border px-3 py-2.5 cursor-pointer
                                        hover:border-neutral-300 hover:shadow-sm
                                        active:scale-[0.98] active:shadow-none
                                        transition-all duration-150 select-none
                                        ${task.isDone
                                            ? "border-neutral-200/60 bg-neutral-50/80"
                                            : "border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-2">
                                        {/* Completion dot indicator */}
                                        <div className={`mt-0.75 w-3 h-3 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                                            task.isDone
                                                ? "bg-emerald-500 border-emerald-500"
                                                : "border-neutral-300 group-hover:border-neutral-400"
                                        }`}>
                                            {task.isDone && (
                                                <svg width="7" height="5.5" viewBox="0 0 8 6" fill="none" aria-hidden="true">
                                                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </div>

                                        <p className={`text-[13px] leading-snug flex-1 ${
                                            task.isDone
                                                ? "line-through text-neutral-400"
                                                : "text-neutral-700"
                                        }`}>
                                            {task.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <InboxTaskModal selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} position={modalPosition} />

            {/* Add new list column */}
            <div className="shrink-0 w-68">
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-100/50 hover:bg-neutral-100 hover:border-neutral-400 transition-colors">
                    <AddNewTask addNewTask={addNewTasklist}>
                        <span className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                            {tasklist.length === 0 ? "Add a list" : "Add another list"}
                        </span>
                    </AddNewTask>
                </div>
            </div>
            <TasklistMoreActions 
                isMoreActionsOpen={isTasklistModalOpen} 
                handleMoreActionChange={handleMoreActionsChange}
                listId = {selectedListId}
                setIsTasklistModalOpen={setIsTasklistModalOpen}
                position={modalPosition}
                 />
        </div>
    );
}