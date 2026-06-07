"use client"
import type { inboxTask as inboxTaskType, Tasklist as tasklistType } from "@repo/shared"
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTasks } from "@/app/providers/TaskContext"
import { useState } from "react"
import MoreActions from "./MoreActionsOnTask"
import { useTasklist } from "@/app/providers/TasklistContext"

type childProp = {
    selectedTaskId: string | null;
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
    position: {top: number, left: number};
}

export default function DisplayTaskModal({ selectedTaskId, setSelectedTaskId, position }: childProp) {
    const { Tasks, updateTask } = useTasks();
    const {tasklist} = useTasklist()
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
    const [isMoreActionsOpen, setIsMoreActionsOpen] = useState<boolean>(false);


    const handleMoreActionsChange = (open: boolean) => {
        setIsMoreActionsOpen(open);
    }

    const selectedTask: inboxTaskType | undefined = Tasks.find(
        task => task.id === selectedTaskId
    )
    const currentTasklist: tasklistType|undefined = tasklist.find(list => list.id === selectedTask?.taskListId);

    function handleOpenChange(open: boolean) {
        if (!open) {
            setSelectedTaskId(null);
            setIsEditingDescription(false);
        }
    }

    function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedTaskId) return;

        const formData = new FormData(e.currentTarget);
        const description = formData.get("description");
        const title = formData.get("title");

        if (typeof description !== "string") return;
        if (typeof title !== "string") return;

        updateTask(selectedTask!.id, { title, description });
        setIsEditingDescription(false);
    }

    function handleTaskCompletion(e: React.ChangeEvent<HTMLInputElement>) {
        if (!selectedTask) return;
        updateTask(selectedTask.id, { isDone: e.target.checked });
    }

    return (
        <Dialog open={!!selectedTask} onOpenChange={handleOpenChange}>
            <DialogContent
                style={{top: `${position.top}px`, left: `${position.left}px`}} 
                className="p-0 gap-0 max-w-125 rounded-2xl border border-neutral-200 bg-white shadow-md overflow-visible [&>button]:hidden"
                >
                <form onSubmit={handleSubmitEdit}>

                  <DialogTitle className="sr-only"></DialogTitle>

                    {/* Header */}
                    <div className="px-5 pt-5 pb-0">
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                                </svg>
                                {
                                    //
                                  currentTasklist?.title
                                }
                            </span>

                            <div className="flex items-center gap-1">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsMoreActionsOpen(true)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                                        aria-label="More actions"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                                        </svg>
                                    </button>
                                    <MoreActions
                                    //
                                        isMoreActionsOpen={isMoreActionsOpen}
                                        handleMoreActionsChange={handleMoreActionsChange}
                                        taskId={selectedTaskId}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleOpenChange(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Title row with checkbox */}
                        <div className="flex items-start gap-3 mb-4">
                            <label className="mt-0.75 shrink-0 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isTaskComplete"
                                    name="isTaskCompleteCheckBox"
                                    checked={selectedTask?.isDone ?? false}
                                    onChange={handleTaskCompletion}
                                    className="sr-only"
                                />
                                <div className={`w-4.5 h-4.5 rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors ${
                                    selectedTask?.isDone
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-neutral-300 bg-white hover:border-neutral-400"
                                }`}>
                                    {selectedTask?.isDone && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                            <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                            </label>

                            {isEditingDescription ? (
                                <Input
                                    defaultValue={selectedTask?.title}
                                    name="title"
                                    id="title-input"
                                    className="text-[17px] font-medium border-0 p-0 h-auto ring-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-neutral-900 bg-transparent"
                                />
                            ) : (
                                <h2 className={`text-[17px] font-medium leading-snug text-neutral-900 ${selectedTask?.isDone ? "line-through text-neutral-400" : ""}`}>
                                    {selectedTask?.title}
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-neutral-100" />

                    {/* Body */}
                    <div className="px-5 py-4 space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                                    </svg>
                                    Description
                                </div>
                                {!isEditingDescription && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingDescription(true)}
                                        className="text-xs text-neutral-400 hover:text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition-colors font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingDescription ? (
                                <Textarea
                                    defaultValue={selectedTask?.description}
                                    name="description"
                                    id="description-textarea"
                                    placeholder="Add a more detailed description..."
                                    className="resize-none text-sm text-neutral-700 border-neutral-200 rounded-lg focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-0 min-h-22.5 bg-neutral-50"
                                />
                            ) : (
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    {selectedTask?.description || "No description"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/60">
                        <button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="text-sm text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-200 hover:border-neutral-300 px-3.5 py-1.5 rounded-lg transition-colors font-medium"
                        >
                            Close
                        </button>

                        {isEditingDescription && (
                            <button
                                type="submit"
                                className="text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-700 px-4 py-1.5 rounded-lg transition-colors"
                            >
                                Save changes
                            </button>
                        )}
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}