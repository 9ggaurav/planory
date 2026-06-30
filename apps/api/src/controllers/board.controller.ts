import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";

const createBoard: RequestHandler = asyncHandler(async (req, res) => {
  try {
    console.log("createBoard called");
    const { title, tag, isPublic, isTemplate, cid } = req.body;
    if (!title || !tag || isPublic === undefined || isTemplate === undefined) {
      throw new ApiError(400, "Missing required fields");
    }

    const defaultCoverImageUrl =
      "https://res.cloudinary.com/dnzei2k46/image/upload/v1757695992/sample.jpg";

    const board = await prisma.board.create({
      data: {
        title,
        tag: ["testing"],
        isPublic,
        isTemplate,
        coverImage: defaultCoverImageUrl,
        creatorId: req.user?.id!,
      },
    });

    console.log("Board created:", board);

    return res
      .status(201)
      .json(new ApiResponse(201, board, "Board created successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to create board", [error]);
  }
});

export { createBoard };
