import { verifyJWT } from "./../middleware/auth.middleware";
import {
  editTask,
  moveTasks,
  deleteTaskById,
} from "../controllers/task.controller";
import { Router } from "express";

const router: Router = Router();

router.route("/:taskId").put(verifyJWT, editTask);
router.route("/:taskId/move").put(verifyJWT, moveTasks);
router.route("/:taskId").delete(verifyJWT, deleteTaskById);

export default router;
