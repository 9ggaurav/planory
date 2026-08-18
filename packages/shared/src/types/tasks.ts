

export type inboxTask = {
    id: number;
    position: number;
    title: string;
    taskListId?: number;
    boardId?: number;
    description?: string;
    isDone: boolean;
    createdAt: string;
    updatedAt?: string;
}