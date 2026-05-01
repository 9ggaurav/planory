import InboxBoardNavbar from "./ProjectBoardComponents/InboxBoardNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";


export default function InboxBoard() {

    const [isAddNewTaskDisplayed, setIsAddNewTaskDisplayed] = useState(false);
    const addTaskButtonRef = useRef<HTMLInputElement>(null);
    const [tasks, setTasks] = useState<string[]>([]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const newTask = formData.get("new-task") as string;

        if (!newTask.trim()) return;

        setTasks(prev => [...prev, newTask.trim()]);

        e.currentTarget.reset();
        handleClick();
    }

    useEffect(() => {
        if (isAddNewTaskDisplayed) {
            addTaskButtonRef.current?.focus();
        }
    }, [isAddNewTaskDisplayed]);

    function handleClick() {
        setIsAddNewTaskDisplayed(!isAddNewTaskDisplayed);
    }


    return (
        <div className="hidden lg:block lg:min-w-[13vw] bg-[#FFF0E8] border-neutral-900 lg:h-245.25 rounded-2xl">
            <InboxBoardNavbar />
            <main>
                <div id="addNewTaskButton-inboxSection" className="flex justify-center w-full">
                    <Button onClick={handleClick} className={clsx(
                        'bg-[#2D5C4F] text-[#8bd4bf] hover:bg-[#194c3e] w-[96%] text-left mx-3 hover:cursor-pointer',
                        isAddNewTaskDisplayed && 'hidden',
                        !isAddNewTaskDisplayed && 'inline'
                    )}>Add a card</Button>
                    {isAddNewTaskDisplayed && (
                        <div className="bg-[#2D5C4F] w-[96%] max-w-100 px-2 py-1 rounded-xl">
                            <form onSubmit={handleSubmit} action="">
                                <Input autoComplete="off" placeholder="Add new task" ref={addTaskButtonRef} name="new-task" className="text-white" />
                                <div className="flex gap-1 text-[12px] mt-1 ">
                                    <Button className="hover:cursor-pointer bg-[#E07A5F] text-white hover:bg-[#c64927]" type="submit" >Add</Button>
                                    <Button className="hover:cursor-pointer bg-[#2D5C4F] hover:bg-[#3b6b5d]" onClick={handleClick}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}