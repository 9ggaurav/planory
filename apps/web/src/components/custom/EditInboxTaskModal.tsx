"use client"
import type { inboxTask as inboxTaskType } from "@repo/shared"
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
} from "@/components/ui/field";
import { useState } from "react"
import { useInboxTask } from "@/app/providers/inboxTaskContext"
import { ReceiptText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type childProp = {
    selectedTask: inboxTaskType | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<inboxTask | null>>;
}

export default function InboxTaskModal({selectedTask, setSelectedTask}: childProp) {
    // const [selectedTask, setSelectedTask] = useState<inboxTaskType | null>(null);
    const {updateTask} = useInboxTask()

    function handleSubmitedit(
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
    return(
        <>
            <Dialog open={!!selectedTask} onOpenChange={(open) => {
            if (!open) setSelectedTask(null)
        }}>

                    <DialogTrigger asChild>
                        <p>{selectedTask?.title}</p>
                    </DialogTrigger>
                    <DialogContent className="fixed left-3/11">
                        <form onSubmit={handleSubmitedit}>
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
                            <DialogFooter className="mt-4">
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
        </>
    )
}