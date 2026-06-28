export type user = {
    id: string,
    email: string,
    name: string,
    avatar?: string,
    hashedPassword: string,
    refreshToken: string,
}