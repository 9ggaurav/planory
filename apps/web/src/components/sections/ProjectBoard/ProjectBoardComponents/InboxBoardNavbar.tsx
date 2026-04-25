import { ArrowDownUp, Ellipsis } from "lucide-react"

export default function InboxBoardNavbar() {
    return (
        <header className="h-12 flex justify-between backdrop-blur-md bg-white/30 pl-3 pt-2">
                <h1 className="text-2xl font-medium"> Inbox</h1>
                <div className="flex justify-around gap-4 px-3">
                    <div className="hover:cursor-pointer p-2 hover:bg-white/40 mb-2">
                        <ArrowDownUp />
                    </div>
                    <div className="hover:cursor-pointer p-2 hover:bg-white/40 mb-2">
                        <Ellipsis />
                    </div>
                </div>
            </header>
    )
}