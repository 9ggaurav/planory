

export type inboxTask = {
    id: string;
    position: number;
    title: string;
    taskListId?: string;
    boardId?:string;
    description?: string;
    isDone: boolean;
    createdAt: string;
}