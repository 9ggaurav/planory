import InboxBoardNavbar from "./ProjectBoardComponents/InboxBoardNavbar"
import { Button } from "@/components/ui/button"

export default function InboxBoard() {
    return (
        <div className="min-w-[14vw] bg-[#FFF0E8] border-neutral-900 h-245.25 rounded-2xl">
            <InboxBoardNavbar />
            <main>
                <div className="flex justify-center">
                    <Button>Add new</Button>
                </div>
            </main>
        </div>
    )
}