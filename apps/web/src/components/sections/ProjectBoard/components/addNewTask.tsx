// Provides a button component to add new task, currently just being used 
// for inbox but can be used to add new tasks in other tasklists 
// just pass function which will add the task to the respective tasklist

import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useDebugValue } from "react";

type childProps = {
    addNewTask: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function AddNewTask({addNewTask}: childProps) {
    const [isAddNewTaskDisplayed, setIsAddNewTaskDisplayed] = useState(false);
    const addTaskButtonRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddNewTaskDisplayed) {
            addTaskButtonRef.current?.focus();
        }
    }, [isAddNewTaskDisplayed])

    function handleClick() {
        setIsAddNewTaskDisplayed(!isAddNewTaskDisplayed)
    }

    return(
        <div id="addNewTaskButton-inboxSection" className="flex justify-center w-[96%] mb-2">
            <Button id="add-new-inbox-task-card" onClick={handleClick} className={clsx(
                'bg-[#2D5C4F] text-[#8bd4bf] hover:bg-[#194c3e] w-[96%] text-left mx-3 hover:cursor-pointer',
                isAddNewTaskDisplayed && 'hidden',
                !isAddNewTaskDisplayed && 'inline'
            )}>Add a card</Button>
            {isAddNewTaskDisplayed && (
                <div className="bg-[#2D5C4F] w-[96%] max-[96%] px-2 py-1 rounded-xl">
                    <form onSubmit={addNewTask} action="">
                        <Input autoComplete="off" placeholder="Add new task" ref={addTaskButtonRef} name="title" className="text-white" />
                        <div onMouseLeave={handleClick} className="flex gap-1 text-[12px] mt-1 ">
                            <Button className="hover:cursor-pointer bg-[#E07A5F] text-white hover:bg-[#c64927]" type="submit" >Add</Button>
                            <Button className="hover:cursor-pointer bg-[#2D5C4F] hover:bg-[#3b6b5d]" onClick={handleClick}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}