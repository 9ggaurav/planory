import { useRef } from "react";
import { useTasks } from "@/app/providers/TaskContext";
import { useTasklist } from "@/app/providers/TasklistContext";

export function useDragAndDrop() {
    const { reorderTasksWithinList, moveTaskToList } = useTasks();
    const { reorderListsWithinBoard } = useTasklist();

    const dragTaskInfo = useRef<{ listId: string; index: number; taskId: string } | null>(null);
    const dragListInfo = useRef<{ boardId: string; index: number } | null>(null);

    // ── Task handlers ───────────────────────────────────────
    const handleTaskDragStart = (listId: string, index: number, taskId: string) => {
        dragTaskInfo.current = { listId, index, taskId };
    };

    const handleTaskDrop = (targetListId: string, dropIndex: number) => {
        if (!dragTaskInfo.current) return;
        const { listId: sourceListId, index: sourceIndex, taskId } = dragTaskInfo.current;

        if (sourceListId === targetListId) {
            reorderTasksWithinList(targetListId, sourceIndex, dropIndex);
        } else {
            moveTaskToList(taskId, targetListId);
        }
        dragTaskInfo.current = null;
    };

    const handleListContainerDrop = (targetListId: string) => {
        if (!dragTaskInfo.current) return;
        if (dragTaskInfo.current.listId === targetListId) return;
        moveTaskToList(dragTaskInfo.current.taskId, targetListId);
        dragTaskInfo.current = null;
    };

    // ── List column handlers (only needed in BoardMain) ─────
    const handleListDragStart = (boardId: string, index: number) => {
        dragListInfo.current = { boardId, index };
    };

    const handleListDrop = (boardId: string, dropIndex: number) => {
        if (!dragListInfo.current || !boardId) return;
        if (dragListInfo.current.boardId !== boardId) return;
        reorderListsWithinBoard(boardId, dragListInfo.current.index, dropIndex);
        dragListInfo.current = null;
    };

    // ── Shared helper for list container's onDrop ───────────
    const handleContainerDrop = (targetListId: string, boardId: string, listDropIndex: number) => {
        if (dragTaskInfo.current) {
            handleListContainerDrop(targetListId);
        } else {
            handleListDrop(boardId, listDropIndex);
        }
    };

    return {
        dragTaskInfo,
        handleTaskDragStart,
        handleTaskDrop,
        handleContainerDrop,
        handleListDragStart,
    };
}