import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";
const getInboxTasks = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(401, "Unauthorized");
    }
    const tasks = await prisma.task.findMany({
        where: {
            userId,
            taskListId: null,
        },
        orderBy: {
            position: "asc",
        },
    });
    return res.status(200).json(new ApiResponse(200, tasks, "Inbox tasks fetched"));
});
const createInboxTask = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId || Number.isNaN(userId)) {
        throw new ApiError(401, "Unauthorized");
    }
    const title = req.body.title?.trim();
    if (!title) {
        throw new ApiError(400, "title can't be null");
    }
    const lastTask = await prisma.task.findFirst({
        where: { userId, taskListId: null },
        orderBy: { position: "desc" },
    });
    const maxPosition = lastTask ? lastTask.position : 0;
    const createdTask = await prisma.task.create({
        data: {
            title,
            isDone: false,
            userId,
            taskListId: null,
            position: maxPosition + 1000,
        },
    });
    return res
        .status(201)
        .json(new ApiResponse(201, createdTask, "Inbox task created successfully!"));
});
export { getInboxTasks, createInboxTask };
//# sourceMappingURL=inbox.controller.js.map