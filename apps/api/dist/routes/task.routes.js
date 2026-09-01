import { verifyJWT } from "./../middleware/auth.middleware";
import { editTask, moveTasks, deleteTaskById, } from "../controllers/task.controller";
import { Router } from "express";
const router = Router();
router.route("/:taskId").patch(verifyJWT, editTask);
router.route("/:taskId/move").patch(verifyJWT, moveTasks);
router.route("/:taskId").delete(verifyJWT, deleteTaskById);
export default router;
//# sourceMappingURL=task.routes.js.map