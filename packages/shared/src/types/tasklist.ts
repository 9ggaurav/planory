export type Tasklist = {
    id: number;
    title: string;
    position: number;
    description: string | null;
    isArchived: boolean;
    boardId: number;
    createdAt: string;
    updatedAt: string | null;
}