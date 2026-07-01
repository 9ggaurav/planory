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

const editTaskList: RequestHandler = asyncHandler(async (req, res) => {
  const tasklistId = Number(req.params.tasklistId);
  if (Number.isNaN(tasklistId)) {
    throw new ApiError(400, "Invalid tasklist id");
  }

  const { title, description, isArchived } = req.body;
  if (!title && !description && isArchived === undefined) {
    throw new ApiError(400, "At least one field must be provided for update");
  }

  const updatedTaskList = await prisma.taskList.update({
    where: {
      id: tasklistId,
    },
    data: {
      title: title?.trim(),
      description: description?.trim(),
      isArchived: isArchived,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTaskList,
        "taskList has been updated successfully!",
      ),
    );
});

const reorderTasklists: RequestHandler = asyncHandler(async (req, res) => {
  const { boardId, tasklistId } = req.params;
  if (Number.isNaN(Number(boardId)) || Number.isNaN(Number(tasklistId))) {
    throw new ApiError(400, "Invalid board id or tasklist id");
  }

  const { position } = req.body;
  if (position === undefined || typeof position !== "number") {
    throw new ApiError(400, "Position must be provided and must be a number");
  }

  const tasklist = await prisma.taskList.findUnique({
    where: {
      id: Number(tasklistId),
    },
  });

  if (!tasklist) {
    throw new ApiError(404, "Tasklist not found");
  }

  const updatedTaskList = await prisma.taskList.update({
    where: {
      id: Number(tasklistId),
    },
    data: {
      position,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTaskList,
        "taskList has been reordered successfully!",
      ),
    );
});

const getAllTasklists: RequestHandler = asyncHandler(async (req, res) => {
    const boardId = Number(req.params.boardId);
    if (Number.isNaN(boardId)) {
        throw new ApiError(400, "Invalid board id");
    }
    const board = await prisma.board.findUnique({
        where: {
            id: boardId
        }
    })
    if (!board) {
        return new ApiError(400, "Board not found");
    }

    const tasklists  = await prisma.taskList.findMany({
        where: {
            boardId
        }
    })

    return res.status(201).json(new ApiResponse(201, tasklists, "retriving all tasklists"))
})

const deleteTasklistById: RequestHandler = asyncHandler(async (req, res) => {
    const boardId = Number(req.params.boardId);
    const tasklistId = Number(req.params.tasklistId);
    if (Number.isNaN(boardId) || Number.isNaN(tasklistId)) {
        throw new ApiError(400, "Invalid board id or tasklist id");
    }
    const board = await prisma.board.findUnique({
        where: {
            id: boardId
        }
    })
    const tasklist = await prisma.taskList.findUnique({
        where: {
            id: tasklistId
        }
    })
    if (!board || !tasklist) {
        return new ApiError(400, "Board or tasklist not found");
    }

    const deletedTasklist = await prisma.taskList.delete({
        where: {
            id: tasklistId
        }
    })

    return res.status(200).json(new ApiResponse(200, deletedTasklist, "Tasklist deleted successfully!"))
})

export { createTaskList, editTaskList, reorderTasklists, getAllTasklists, deleteTasklistById };
