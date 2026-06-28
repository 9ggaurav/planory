import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";


export const verifyJWT: RequestHandler = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string )
    
        const user = await prisma.user.findUnique({
            where: {
                id: (decodedToken as { id: number}).id
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                role: true
            }
        })
    
        if (!user) {
            // TODO: about frontend
            throw new ApiError(401, "Unauthorized request: User not found");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
})