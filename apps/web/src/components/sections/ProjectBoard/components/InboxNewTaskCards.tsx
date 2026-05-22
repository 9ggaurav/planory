"use client"
import type { inboxTask } from "@repo/shared"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import type { userBoard as BoardType } from '@repo/shared';
import { Textarea } from "@/components/ui/textarea"
import { ReceiptText } from "lucide-react"
import { useState, useEffect } from "react"
import { useInboxTask } from "@/app/providers/inboxTaskContext"




export default function InboxNewTaskCards() {
    const [selectedTask, setSelectedTask] = useState<inboxTask | null>(null);
    const {inboxTasks, updateTask} = useInboxTask();
    const [isDone, setIsDone] = useState(
        selectedTask?.isDone ?? false
    )

    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
        ) {
        e.preventDefault();
        if (!selectedTask) return;
        const formData = new FormData(e.currentTarget);
        const description =
            formData.get("description");

        if (typeof description !== "string") {
            return;
        }

        updateTask(selectedTask.id, {
            description,
        });

        setSelectedTask(null);
    }

    return (
        <div className="w-full flex justify-start flex-col-reverse items-center gap-1 overflow-y-auto">
            {inboxTasks && inboxTasks.map(task => (
            <div onClick={() => setSelectedTask(task)} id="new-inbox-task-card" draggable={true} className="bg-[#2D5C4F] text-[#8bd4bf] min-h-[35.99px] hover:bg-[#194c3e] w-[96%] px-2 py-1 rounded-sm text-left mx-3 hover:cursor-pointer" key={task.id}>
                <p>{task.title}</p>
            </div>
        ))}
        <Dialog open={!!selectedTask} onOpenChange={(open) => {
            if (!open) setSelectedTask(null)
        }}>

                    <DialogTrigger asChild>
                        <p>{selectedTask?.title}</p>
                    </DialogTrigger>
                    <DialogContent className="fixed left-3/11">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <header>
                                    <p>
                                        <strong>In your Inbox</strong>
                                    </p>
                                </header>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                    <Input
                                        className="size-[0.9rem]"
                                        type="checkbox"
                                        id="isTaskComplete"
                                        name="isTaskComplete"
                                        
                                        // defaultChecked={selectedTask?.isDone}
                                        // checked={boardData.isTemplate}
                                        // onChange={handleChange}
                                    />
                                    <FieldContent>
                                        <DialogTitle className="text-2xl font-bold">{selectedTask?.title}</DialogTitle>
                                    </FieldContent>
                                </Field>
                                </FieldLabel>
                            </DialogHeader>
                            <div className="mt-2">
                                <Label className="text-[16px]" htmlFor="description-textarea">
                                    <span><ReceiptText /></span>
                                    <p>Description</p>
                                </Label>
                                <Textarea defaultValue={selectedTask?.description} name="description" id="description-textarea" placeholder="Add some more detailed description here..."></Textarea>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
        </div>
    )
}

