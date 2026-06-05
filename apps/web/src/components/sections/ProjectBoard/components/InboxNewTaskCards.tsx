"use client"
import { useState } from "react"
import { useInboxTask } from "@/app/providers/inboxTaskContext"
import InboxTaskModal from "@/components/custom/EditInboxTaskModal"
// import { useDragAndDrop } from "@/app/providers/useDragAndDrop"
import { useDnD } from "@/app/providers/DragAndDropContext"

export default function InboxNewTaskCards() {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const {inboxTasks} = useInboxTask();
    const {handleTaskDragStart, handleTaskDrop} = useDnD();

    const InboxOnlyTasks = inboxTasks.filter(
        task => task.taskListId === "inbox"
    ).sort(
        (a, b) => a.position - b.position
    )

    return (
        <div className="w-full flex justify-start flex-col-reverse items-center gap-1 overflow-y-auto">
            {InboxOnlyTasks && InboxOnlyTasks.map((task, index) => (
            <div 
                onClick={() => setSelectedTaskId(task.id)} 
                id="new-inbox-task-card" 
                draggable={true} 
                className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer" 
                key={task.id}
                onDragStart={(e) => {handleTaskDragStart("inbox", index, task.id)}}
                onDragOver={(e)=> e.preventDefault()}
                onDrop={() => handleTaskDrop("inbox", index)}
                >
                <p 
                className={`
                    ${task.isDone ? 'line-through opacity-75' : ''} flex
                `}

                >   
                    {task.title}
                </p>
            </div>
        ))}
            <InboxTaskModal selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />
        </div>
    )
}

