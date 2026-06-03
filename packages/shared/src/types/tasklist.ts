export type Tasklist = {
    id: string;
    title: string;
    position: number;
    description: string;
    isArchieved: boolean;
    boardId: string;
    createdAt: string;
    updatedAt: string | null;
}