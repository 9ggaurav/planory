import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";


// get boards for logged in user only
const getAllBoardsForLoggedInUser: RequestHandler = asyncHandler(async (req, res) => {    // return all boards for logged in user only
  const userId = req.user?.id as number;
  console.log("userId", userId);
  if (Number.isNaN(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const boards = await prisma.board.findMany({
    where: {
      creatorId: userId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Boards fetched successfully"));
});

const createBoard: RequestHandler = asyncHandler(async (req, res) => {
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
  });

const getAllPublicBoards: RequestHandler = asyncHandler(async (req, res) => {
  const boards = await prisma.board.findMany({
    where: {
      isPublic: true,
    },
    select: {
      id: true,
      title: true,
      tag: true,
      isPublic: true,
      isTemplate: true,
      coverImage: true,
      creatorId: true,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Public boards fetched successfully"));
});

const getBoardById: RequestHandler = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    if (!boardId) {
      throw new ApiError(400, "Board ID is required");
    }

    const board = await prisma.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, board, "Board fetched successfully"));
  });

// ?
const userBoards: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized request: User not authenticated");
  }

  const boards = await prisma.board.findMany({
    where: {
      creatorId: userId,
    },
    select: {
      id: true,
      title: true,
      tag: true,
      isPublic: true,
      isTemplate: true,
      coverImage: true,
      creatorId: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "User's boards fetched successfully"));
});

const updateBoardDetails: RequestHandler = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { title, tag, isPublic, isTemplate } = req.body;

    if (!boardId) {
      throw new ApiError(400, "Board ID is required");
    }

    if (!title && !tag && isPublic === undefined && isTemplate === undefined) {
      throw new ApiError(
        400,
        "At least one field (title, tag, isPublic, isTemplate) must be provided for update",
      );
    }

    const board = await prisma.board.update({
      where: {
        id: Number(boardId),
      },
      data: {
        title: title || undefined,
        tag: tag || undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined,
        isTemplate: isTemplate !== undefined ? isTemplate : undefined,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, board, "Board details updated successfully"));
  });

const updateBoardCoverImage: RequestHandler = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const coverImageLocalPath = req.file?.path;

    if (!boardId) {
      throw new ApiError(400, "board not provided");
    }

    if (!coverImageLocalPath) {
      throw new ApiError(400, "cover image not provided");
    }

    console.log("coverImageLocalPath", coverImageLocalPath);

    const coverImageLink = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImageLink) {
      throw new ApiError(
        500,
        "something went wrong while uploading image on cloudinary",
      );
    }

    await prisma.board.update({
      where: {
        id: Number(boardId),
      },
      data: {
        coverImage: coverImageLink.url,
      },
    });

    await fs.unlink(coverImageLocalPath, (error) => {
      if (error) throw new ApiError(500, "error while deleting local file");
      console.log("local file deleted successfully");
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "coverImage Updated sucessfully"));
  });

const deleteBoardById: RequestHandler = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!boardId) {
    throw new ApiError(400, "cannot find board");
  }

  const deletedBoard = await prisma.board.delete({
    where: {
      id: Number(boardId),
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedBoard,
        "board has been deleted successfully!",
      ),
    );
});

// tasklist controller functions
const getAllTasklists: RequestHandler = asyncHandler(async (req, res) => {
  const boardId = Number(req.params.boardId);
  if (Number.isNaN(boardId)) {
    throw new ApiError(400, "Invalid board id");
  }
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });
  if (!board) {
    throw new ApiError(400, "Board not found");
  }

  const tasklists = await prisma.taskList.findMany({
    where: {
      boardId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tasklists, "retriving all tasklists"));
});

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

export {
  getAllBoardsForLoggedInUser,
  createBoard,
  getAllPublicBoards,
  getBoardById,
  userBoards,
  updateBoardDetails,
  updateBoardCoverImage,
  deleteBoardById,
  getAllTasklists,
  createTaskList,
};
