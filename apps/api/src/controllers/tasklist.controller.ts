
import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";
import type { Prisma } from '../generated/prisma/browser';

const getTaskListById: RequestHandler = asyncHandler(async (req, res) => {
  const tasklistId = Number(req.params.tasklistId);
  if (Number.isNaN(tasklistId)) {
    throw new ApiError(400, "Invalid tasklist id");
  }

  const tasklist = await prisma.taskList.findUnique({
    where: {
      id: tasklistId,
    },
  })

  return res.status(200).json(
    new ApiResponse(200, tasklist, "retrieving tasklist by id")
  );
})

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

const moveTaskList: RequestHandler = asyncHandler(async (req, res) => {
  console.log("is this running?")
  const taskListId = Number(req.params.tasklistId);

  if (Number.isNaN(taskListId)) {
    throw new ApiError(400, "Invalid task list id");
  }

  const { position, boardId } = req.body;

  if (typeof position !== "number" || !Number.isFinite(position)) {
    throw new ApiError(400, "Position must be a valid number");
  }

  const taskList = await prisma.taskList.findUnique({
    where: {
      id: taskListId,
    },
  });

  if (!taskList) {
    throw new ApiError(404, "Task list not found");
  }

  const updateData: Prisma.TaskListUpdateInput = {
    position,
  };

  // Only if the client wants to move it to another board
  if (boardId !== undefined) {
    const parsedBoardId = Number(boardId);

    if (Number.isNaN(parsedBoardId)) {
      throw new ApiError(400, "Invalid board id");
    }

    const board = await prisma.board.findUnique({
      where: {
        id: parsedBoardId,
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    updateData.board = {
      connect: {
        id: parsedBoardId,
      },
    };
  }

  const updatedTaskList = await prisma.taskList.update({
    where: {
      id: taskListId,
    },
    data: updateData,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedTaskList,
      "Task list moved successfully."
    )
  );
});

const deleteTasklistById: RequestHandler = asyncHandler(async (req, res) => {
  const tasklistId = Number(req.params.tasklistId);
  if (Number.isNaN(tasklistId)) {
    throw new ApiError(400, "Invalid tasklist id");
  }
  const tasklist = await prisma.taskList.findUnique({
    where: {
      id: tasklistId,
    },
  });
  if (!tasklist) {
    throw new ApiError(400, "Tasklist not found");
  }

  const deletedTasklist = await prisma.taskList.delete({
    where: {
      id: tasklistId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedTasklist, "Tasklist deleted successfully!"),
    );
});

// task controllers

const createTask: RequestHandler = asyncHandler(async (req, res) => {
  const taskListId = Number(req.params.tasklistId);
  if (Number.isNaN(taskListId)) {
    throw new ApiError(400, "Invalid task list id");
  }

  const title = req.body.title?.trim();
  if (!title) {
    throw new ApiError(400, "title can't be null");
  }

  const taskList = await prisma.taskList.findUnique({
    where: {
      id: taskListId,
    },
  });

  if (!taskList) {
    throw new ApiError(404, "taskList not found");
  }

  const lastTask = await prisma.task.findFirst({
    where: {
      taskListId: taskListId,
    },
    orderBy: {
      position: "desc",
    },
  });

  let maxPosition;
  if (!lastTask) {
    maxPosition = 0;
  } else {
    maxPosition = lastTask.position;
  }

  const createdTask = await prisma.task.create({
    data: {
      title,
      isDone: false,
      taskListId: taskListId,
      userId: null,
      position: maxPosition + 1000,
    },
  });

  console.log("Created task:", createdTask);

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdTask, "task has been created successfully!"),
    );
});

const getAllTasks: RequestHandler = asyncHandler(async (req, res) => {
  const taskListId = Number(req.params.tasklistId);
  if (Number.isNaN(taskListId)) {
    throw new ApiError(400, "Invalid task list id");
  }
  const taskList = await prisma.taskList.findUnique({
    where: {
      id: taskListId,
    },
  });
  if (!taskList) {
    throw new ApiError(404, "Task list not found");
  }

  const tasks = await prisma.task.findMany({
    where: {
      taskListId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "retriving all tasks"));
});

export {
  getTaskListById,
  editTaskList,
  moveTaskList,
  createTask,
  deleteTasklistById,
  getAllTasks
};
