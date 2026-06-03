// import { ChevronDown, Eye } from "lucide-react"

import TaskListBoardMain from "./components/TaskListBoardMain"
import TasklistBoardNavbar from "./ProjectBoardComponents/TasklistBoardNavbar"

export default function TasklistBoard() {
    return (
        <div className="bg-[#E8F7F2] border-neutral-900 h-245.25 rounded-2xl">
            <TasklistBoardNavbar />
            <main className="h-full w-full">
                <TaskListBoardMain />
            </main>

        </div>
    )
}