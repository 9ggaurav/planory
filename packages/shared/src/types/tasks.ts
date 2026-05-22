

export type inboxTask = {
    id: string;
    position?: number;
    title: string;
    taskListId?: string;
    boardId?:string;
    isInbox?: boolean;
    description?: string;
    isDone: boolean;
    createdAt: string;
}