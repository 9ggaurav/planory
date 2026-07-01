import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";

const createTaskList: RequestHandler = asyncHandler(async (req, res) => {
  const boardId = Number(req.params.boardId);
  if (Number.isNaN(boardId)) {
    throw new ApiError(400, "Invalid board id");
  }

  const title = req.body.title?.trim();
  if (!title) {
    throw new ApiError(400, "title can't be null");
  }

  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const lastTaskList = await prisma.taskList.findFirst({
    where: {
      boardId: Number(boardId),
    },
    orderBy: {
      position: "desc",
    },
  });

  let maxPosition;
  if (!lastTaskList) {
    maxPosition = 0;
  } else {
    maxPosition = lastTaskList.position;
  }

  const createdTaskList = await prisma.taskList.create({
    data: {
      title,
      isArchived: false,
      boardId: Number(boardId),
      position: maxPosition + 1000,
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdTaskList,
        "taskList has been created successfully!",
      ),
    );
});

export { createTaskList };
