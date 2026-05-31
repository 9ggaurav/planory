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
    selectedTaskId: string | null;
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function InboxTaskModal({selectedTaskId, setSelectedTaskId}: childProp) {
    const {inboxTasks, updateTask} = useInboxTask();
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);

    const selectedTask: inboxTaskType | undefined = inboxTasks.find(
      task => task.id === selectedTaskId
    )

    function handleOpenChange(open: boolean) {
        if (!open) {
        setSelectedTaskId(null);
        setIsEditingDescription(false); // ✅ reset edit state on close
        }
    }


    function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!selectedTaskId) return;

        const formData = new FormData(e.currentTarget);
        const description = formData.get("description");

        if (typeof description != "string") return;
        updateTask(selectedTask!.id, {description});
        setIsEditingDescription(false)
        // setSelectedTask(null)
    }

    function handleTaskCompletion(e: React.ChangeEvent<HTMLInputElement>) {
      if (!selectedTask) return;
      updateTask(selectedTask.id, {
        isDone: e.target.checked,
      })

    }

    return(
        <>
          <Dialog open={!!selectedTask} onOpenChange={handleOpenChange}>
            <DialogContent className="fixed left-3/11">
              <form onSubmit={handleSubmitEdit}>
                <DialogHeader>
                  <p className="text-sm font-medium text-muted-foreground">
                    In your Inbox
                  </p>
                  <FieldLabel className="border-0 shadow-none">
                    <Field orientation="horizontal">
                      <Input
                        className="size-[1.3rem] rounded-2xl"
                        type="checkbox"
                        id="isTaskComplete"
                        name="isTaskCompleteCheckBox"
                        checked={selectedTask?.isDone ?? false}
                        onChange={handleTaskCompletion}
                      />
                      <FieldContent>
                        <DialogTitle className={`text-[20px] font-semibold ${selectedTask?.isDone ? 'line-through' : ''}`}>
                          {selectedTask?.title}
                        </DialogTitle>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </DialogHeader>

                <div className="mt-2">
                  <Label
                    className="text-[16px] flex justify-between"
                    htmlFor="description-textarea"
                  >
                    <div className="flex gap-1 text-neutral-500">
                      <ReceiptText />
                      <span>Description</span>
                    </div>
                    {!isEditingDescription && (
                      <Button
                        type="button"
                        onClick={() => setIsEditingDescription(true)} 
                        className="bg-neutral-200 text-neutral-950 px-2 py-1 hover:cursor-pointer hover:bg-neutral-300"
                      >
                        Edit
                      </Button>
                    )}
                  </Label>

                  {isEditingDescription ? (
                    <Textarea
                      defaultValue={selectedTask?.description}
                      name="description"
                      id="description-textarea"
                      placeholder="Add some more detailed description here..."
                    />
                  ) : (
                    <DialogDescription className="text-neutral-400">
                        {selectedTask?.description ?? "No Description"}
                    </DialogDescription>
                  )}
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  {isEditingDescription && <Button type="submit">Save</Button>}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
    )
}