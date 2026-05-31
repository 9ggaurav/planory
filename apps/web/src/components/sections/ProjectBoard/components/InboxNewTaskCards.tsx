"use client"
import type {inboxTask as inboxTaskType } from '@repo/shared';
import { useState } from "react"
import { useInboxTask } from "@/app/providers/inboxTaskContext"
import InboxTaskModal from "@/components/custom/EditInboxTaskModal"

export default function InboxNewTaskCards() {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const {inboxTasks} = useInboxTask();

    return (
        <div className="w-full flex justify-start flex-col-reverse items-center gap-1 overflow-y-auto">
            {inboxTasks && inboxTasks.map(task => (
            <div onClick={() => setSelectedTaskId(task.id)} id="new-inbox-task-card" draggable={true} className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer" key={task.id}>
                <p 
                className={
                    task?.isDone ? 'line-through opacity-75' : ''
                }
                >{task.title}</p>
            </div>
        ))}
            <InboxTaskModal selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />
        </div>
    )
}

