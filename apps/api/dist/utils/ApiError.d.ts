declare class ApiError extends Error {
    statusCode: number;
    errors: any[];
    constructor(statusCode: number, message: string, errors?: any[]);
}
export { ApiError };
//# sourceMappingURL=ApiError.d.ts.map