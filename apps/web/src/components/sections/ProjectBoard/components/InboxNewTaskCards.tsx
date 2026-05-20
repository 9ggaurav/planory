import type { inboxTask } from "@repo/shared"

export default function InboxNewTaskCards({tasks}: {tasks: inboxTask[]}) {
    return (
        <div className="w-full flex justify-start flex-col-reverse items-center gap-1 overflow-y-auto">
            {tasks && tasks.map(task => (
            <div draggable={true} className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer" key={task.id}>{task.title}</div>
        ))}
        </div>
    )
}

