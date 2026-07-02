import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const verifyJWT: RequestHandler = asyncHandler(
  async (req, res, next) => {
    try {
      console.log("Verifying jwt started");

      const token =
        req.cookies?.accessToken ||
        req.header("authorization")?.replace("Bearer ", "").trim();

      // console.log("Request cookies:", req.cookies); // Log the cookies for debugging
      // console.log("Request headers:", req.headers); // Log the headers for debugging
      // console.log("Token from cookies or header:", token); // Log the token for debugging

      if (!token) {
        throw new ApiError(401, "Unauthorized request: No token provided");
      }

      // console.log("Token:", token); // Log the token for debugging

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
      );

      const user = await prisma.user.findUnique({
        where: {
          id: (decodedToken as { id: number }).id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      });

      if (!user) {
        // TODO: about frontend
        throw new ApiError(401, "Unauthorized request: User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token");
    }
  },
);
