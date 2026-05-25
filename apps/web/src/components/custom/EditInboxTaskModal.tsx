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
import { useInboxTask } from "@/app/providers/inboxTaskContext"
import { ReceiptText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"

type childProp = {
    selectedTask: inboxTaskType | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<inboxTask | null>>;
}

export default function InboxTaskModal({selectedTask, setSelectedTask}: childProp) {
    const {updateTask} = useInboxTask();
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);

    function editDescription() { 
        setIsEditingDescription(true);
    }

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
        setIsEditingDescription(false);

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
                                <FieldLabel className="border-0 shadow-none">
                                    <Field orientation="horizontal">
                                    <Input
                                        className="size-[1.3rem] rounded-2xl"
                                        type="checkbox"
                                        id="isTaskComplete"
                                        name="isTaskComplete"
                                        
                                        // defaultChecked={selectedTask?.isDone}
                                        // checked={boardData.isTemplate}
                                        // onChange={handleChange}
                                    />
                                    <FieldContent>
                                        <DialogTitle className="text-[20px] font-semibold">{selectedTask?.title}</DialogTitle>
                                    </FieldContent>
                                </Field>
                                </FieldLabel>
                            </DialogHeader>
                            <div className="mt-2">
                                <Label className="text-[16px] flex justify-between" htmlFor="description-textarea">
                                    <div className="flex gap-1 text-neutral-500">
                                        <span><ReceiptText /></span>
                                        <p>Description</p>
                                    </div>
                                    <Button type="button" onClick={() => editDescription()} className="bg-neutral-200 text-neutral-950 px-2 py-1 hover:cursor-pointer hover:bg-neutral-300">edit</Button>                           
                                </Label>
                                {
                                    !isEditingDescription ? 
                                        <DialogDescription>
                                            {selectedTask?.description ? selectedTask.description : <p className="text-neutral-400">No Description</p>}
                                        </DialogDescription>
                                        : <Textarea defaultValue={selectedTask?.description} name="description" id="description-textarea" placeholder="Add some more detailed description here..."></Textarea>
                                }
                                
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