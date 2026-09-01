import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";
// relaxed typing for update payload to avoid mismatches with generated Prisma types
const editTask = asyncHandler(async (req, res) => {
    const taskId = Number(req.params.taskId);
    if (Number.isNaN(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }
    const { title, description, isDone } = req.body;
    if (!title && !description && isDone === undefined) {
        throw new ApiError(400, "At least one field must be provided for update");
    }
    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            title: title?.trim(),
            description: description?.trim(),
            isDone: isDone,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "task has been updated successfully!"));
});
// const moveTasks: RequestHandler = asyncHandler(async (req, res) => {
//   const taskId = Number(req.params.taskId);
//   if (Number.isNaN(Number(taskId))) {
//     throw new ApiError(400, "Invalid tasklist id or task id");
//   }
//   const { position, tasklistId } = req.body;
//   if (!Number.isFinite(position) || typeof position !== "number") {
//     throw new ApiError(400, "Position must be provided and must be a number");
//   }
//   const task = await prisma.task.findUnique({
//     where: {
//       id: Number(taskId),
//     },
//   });
//   if (!task) {
//     throw new ApiError(404, "Task not found");
//   }
//   const updateData: Prisma.TaskUpdateInput = {
//     position,
//   };
//   if (tasklistId != undefined) {
//     const parsedTasklistId = Number(tasklistId);
//     if (Number.isNaN(parsedTasklistId)) {
//       throw new ApiError(400, "Invalid tasklist id");
//     }
//     const taskList = await prisma.taskList.findUnique({
//       where: {
//         id: parsedTasklistId,
//       },
//     });
//     if (!taskList) {
//       throw new ApiError(404, "Task list not found");
//     }
//     updateData.taskList = {
//       connect: {
//         id: parsedTasklistId,
//       },
//     };
//   }
//   const updatedTask = await prisma.task.update({
//     where: {
//       id: Number(taskId),
//     },
//     data: updateData,
//   });
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         updatedTask,
//         "task has been reordered successfully!",
//       ),
//     );
// });
const moveTasks = asyncHandler(async (req, res) => {
    const taskId = Number(req.params.taskId);
    if (Number.isNaN(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }
    const { position, tasklistId } = req.body;
    if (!Number.isFinite(position) || typeof position !== "number") {
        throw new ApiError(400, "Position must be provided and must be a number");
    }
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    // use a loose type here because generated Prisma types in this workspace
    // don't accept some nested operations we need (disconnect/connect).
    const updateData = { position };
    if (tasklistId === null) {
        // Moving into the inbox: detach from tasklist, attach directly to user
        updateData.taskList = { disconnect: true };
        updateData.user = { connect: { id: req.user.id } };
    }
    else if (tasklistId !== undefined) {
        const parsedTasklistId = Number(tasklistId);
        if (Number.isNaN(parsedTasklistId)) {
            throw new ApiError(400, "Invalid tasklist id");
        }
        const taskList = await prisma.taskList.findUnique({ where: { id: parsedTasklistId } });
        if (!taskList) {
            throw new ApiError(404, "Task list not found");
        }
        // Moving out of the inbox into a real list: attach tasklist, detach direct user link
        updateData.taskList = { connect: { id: parsedTasklistId } };
        updateData.user = { disconnect: true };
    }
    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "task has been reordered successfully!"));
});
const deleteTaskById = asyncHandler(async (req, res) => {
    const taskId = Number(req.params.taskId);
    if (Number.isNaN(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    const deletedTask = await prisma.task.delete({
        where: {
            id: taskId,
        },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, deletedTask, "Task deleted successfully!"));
});
export { editTask, moveTasks, deleteTaskById };
//# sourceMappingURL=task.controller.js.map