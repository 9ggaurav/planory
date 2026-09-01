export type inboxTask = {
    id: number;
    position: number;
    title: string;
    taskListId?: number | null;
    userId?: number | null;
    boardId?: number;
    description?: string | null;
    isDone: boolean;
    createdAt: string;
    updatedAt?: string;
}