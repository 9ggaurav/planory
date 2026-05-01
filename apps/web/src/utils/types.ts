export type userBoard = {
    id?: string;
    coverImage: string;
    title: string;
    tag: string;
    isTemplate: boolean,
    isPublic?: boolean;
    creator?: string;
    liked: boolean
};

export type inboxTask = {
    id: string;
    title: string;
    taskListId?: string;
    boardId?:string;
}