import { ArrowDownUp, Ellipsis } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Inbox } from "lucide-react";


export default function InboxBoardNavbar() {
    return (
        <header className="h-16 flex justify-between backdrop-blur-md bg-white/30 pl-3 pt-2 rounded-2xl">
            <div className="flex gap-2">
                <Inbox />
                <h1 className="text-[20px] font-medium"> Inbox</h1>
            </div>
                <div className="flex justify-around gap-4 px-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="hover:cursor-pointer p-2 hover:bg-white/40 mb-2">
                                <ArrowDownUp />
                            </div>
                        </TooltipTrigger>

                        <TooltipContent className="bg-neutral-50 text-neutral-950" side="bottom">
                            <p>Sort</p>
                        
                        </TooltipContent>
                    </Tooltip>
                    <div className="hover:cursor-pointer p-2 hover:bg-white/40 mb-2">
                        <Ellipsis />
                    </div>
                </div>
            </header>
    )
}