import { Kanban } from "lucide-react"
// import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TasklistBoardNavbar() {
    return (
        <header className="h-16 flex justify-between backdrop-blur-md bg-white/30 pl-3 pt-2 rounded-2xl">
                <div className="flex justify-start gap-2">
                    <h1 className="text-[20px] font-medium"> Tasklist Name </h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex px-4 gap-0 hover:cursor-pointer hover:bg-white/40 mb-2">
                                <Kanban className="relative" />
                            </div>
                        </TooltipTrigger>

                        <TooltipContent className="bg-neutral-50 text-neutral-950" side="bottom">
                            <p>Views</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
        </header>
    )
}