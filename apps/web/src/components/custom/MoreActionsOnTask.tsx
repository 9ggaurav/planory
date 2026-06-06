"use client"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useInboxTask } from "@/app/providers/inboxTaskContext";

type childProp = {
    isMoreActionsOpen: boolean;
    handleMoreActionsChange: (open: boolean) => void;
    taskId: string | null;
}

export default function MoreActions({isMoreActionsOpen, handleMoreActionsChange, taskId}: childProp) {
    const {deleteTask, archieveTask} = useInboxTask();

    const handleArchieve = (id: string|null) => {
        if (!id) return;
        archieveTask(id);
        handleMoreActionsChange(false)
    }

    const handleDelete = (taskId: string | null) => {
        if (!taskId) return
        deleteTask(taskId);
        handleMoreActionsChange(false);
    }
    return(
        <Dialog open={isMoreActionsOpen} onOpenChange={handleMoreActionsChange}>
            <DialogContent className="fixed left-3/6">
                <DialogTitle>Dialog modal</DialogTitle>
                <div>
                    <Button onClick={()=> handleArchieve(taskId)}>Archieve</Button>
                    <Button onClick={() => handleDelete(taskId)} className="primary">Delete Task</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}