// import { ChevronDown, Eye } from "lucide-react"

import TasklistBoardNavbar from "./ProjectBoardComponents/TasklistBoardNavbar"

export default function TasklistBoard() {
    return (
        <div className="w-[84vw] bg-blue-500 border-neutral-900 h-[calc(100vh-68px)]">
            <TasklistBoardNavbar />
            <h1>Board</h1>
        </div>
    )
}