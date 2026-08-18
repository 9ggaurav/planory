import { verifyJWT } from "../middleware/auth.middleware";
import {
  getTaskListById,
  editTaskList,
  moveTaskList,
  deleteTasklistById,
  createTask,
  getAllTasks
} from "../controllers/tasklist.controller";
import { Router } from "express";

const router: Router = Router();

router.route("/:tasklistId").get(verifyJWT, getTaskListById);
router.route("/:tasklistId").patch(verifyJWT, editTaskList);
router.route("/:tasklistId/move").patch(verifyJWT, moveTaskList);
router.route("/:tasklistId").delete(deleteTasklistById);

// task routes
router.route("/:tasklistId/tasks").post(verifyJWT, createTask);
router.route("/:tasklistId/tasks").get(verifyJWT, getAllTasks);


export default router;
