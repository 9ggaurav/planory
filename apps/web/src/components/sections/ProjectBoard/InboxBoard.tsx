import InboxBoardNavbar from "./ProjectBoardComponents/InboxBoardNavbar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import clsx from "clsx";

export default function InboxBoard() {

    const [isAddNewTaskDisplayed, setIsAddNewTaskDisplayed] = useState(false);

    function handleClick() {
        alert("clicked")
        setIsAddNewTaskDisplayed(!isAddNewTaskDisplayed);
    }

    return (
        <div className="min-w-[13vw] bg-[#FFF0E8] border-neutral-900 h-245.25 rounded-2xl">
            <InboxBoardNavbar />
            <main>
                <div className="flex justify-center w-full">
                    <Button onClick={handleClick} className={clsx(
                        'bg-[#e15934] hover:bg-[#892e15] w-full mx-3 hover:cursor-pointer',
                        isAddNewTaskDisplayed && 'hidden',
                        !isAddNewTaskDisplayed && 'inline'
                    )}>Add new</Button>
                    {isAddNewTaskDisplayed && (
                        <div >
                            <input />
                            <Button>submit</Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}