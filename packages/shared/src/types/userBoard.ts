export type userBoard = {
    id?: string;
    coverImage: string;
    title: string;
    tag: string;
    isTemplate: boolean,
    isPublic?: boolean;
    creator?: string;
    created_at: string,
    updated_at: string,
    // creatorId: string,
};
