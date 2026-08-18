import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";

// Ensure a per-user Inbox board + tasklist exists, return the tasklist
const getOrCreateInboxTasklist: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as number;
  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  // Find a board owned by the user that is titled 'Inbox' (case sensitive)
  let board = await prisma.board.findFirst({
    where: {
      creatorId: userId,
      title: "Inbox",
    },
  });

  if (!board) {
    board = await prisma.board.create({
      data: {
        title: "Inbox",
        tag: ["inbox"],
        isPublic: false,
        isTemplate: false,
        creatorId: userId,
      },
    });
  }

  // Find or create the tasklist named 'Inbox' on that board
  let tasklist = await prisma.taskList.findFirst({
    where: {
      boardId: board.id,
      title: "Inbox",
    },
  });

  if (!tasklist) {
    const lastTaskList = await prisma.taskList.findFirst({
      where: { boardId: board.id },
      orderBy: { position: "desc" },
    });

    const maxPosition = lastTaskList ? lastTaskList.position : 0;

    tasklist = await prisma.taskList.create({
      data: {
        title: "Inbox",
        description: null,
        isArchived: false,
        boardId: board.id,
        position: maxPosition + 1000,
      },
    });
  }

  return res.status(200).json(new ApiResponse(200, tasklist, "Inbox tasklist fetched"));
});

export { getOrCreateInboxTasklist };
