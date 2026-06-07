
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

type childProps = {
    addNewTask: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    className?: string;
}

export default function AddNewTask({ addNewTask, children }: childProps) {
    const [isAddNewTaskDisplayed, setIsAddNewTaskDisplayed] = useState(false);
    const addTaskButtonRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddNewTaskDisplayed) {
            addTaskButtonRef.current?.focus();
        }
    }, [isAddNewTaskDisplayed]);

    function handleClick() {
        setIsAddNewTaskDisplayed(!isAddNewTaskDisplayed);
    }

    return (
        <div id="addNewTaskButton-inboxSection" className="w-full px-2 mb-1">
            {!isAddNewTaskDisplayed ? (
                <button
                    id="add-new-inbox-task-card"
                    onClick={handleClick}
                    type="button"
                    className="w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors text-left"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {children}
                </button>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-xl p-2.5 shadow-sm">
                    <form onSubmit={(e) => { addNewTask(e); setIsAddNewTaskDisplayed(false); }}>
                        <Input
                            autoComplete="off"
                            placeholder="Task name..."
                            ref={addTaskButtonRef}
                            name="title"
                            className="text-[13px] text-neutral-800 border-neutral-200 bg-neutral-50 focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-0 rounded-lg h-8 px-2.5 placeholder:text-neutral-400"
                        />
                        <div className="flex gap-1.5 mt-2">
                            <button
                                type="submit"
                                className="text-[12px] font-medium text-white bg-neutral-900 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={handleClick}
                                className="text-[12px] font-medium text-neutral-500 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}