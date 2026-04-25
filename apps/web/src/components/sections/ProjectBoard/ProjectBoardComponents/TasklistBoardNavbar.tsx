import { Eye } from "lucide-react"
// import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TasklistBoardNavbar() {
    return (
        <header className="h-12 flex justify-between backdrop-blur-md bg-white/30 pl-3 pt-2">
                <div className="flex justify-start gap-2">
                    <h1 className="text-2xl font-medium"> Tasklist Name </h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex px-4 gap-0 hover:cursor-pointer hover:bg-white/40 mb-2">
                                <Eye className="relative top-1" />
                            </div>
                        </TooltipTrigger>

                        <TooltipContent side="bottom">
                            <p>Views</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
        </header>
    )
}