import { verifyJWT } from "../middleware/auth.middleware";
import {
  createTaskList,
  editTaskList,
  reorderTasklists,
  getAllTasklists,
  deleteTasklistById
} from "../controllers/tasklist.controller";
import { Router } from "express";

const router: Router = Router();

router.route("/:boardId/create-tasklist").post(verifyJWT, createTaskList);
router.route("/:boardId/:tasklistId/edit").put(verifyJWT, editTaskList);
router
  .route("/:boardId/tasklist/:tasklistId/reorder")
  .put(verifyJWT, reorderTasklists);

router.route("/:boardId/tasklists").get(verifyJWT, getAllTasklists)
router.route("/:boardId/tasklist/:tasklistId/delete").delete(deleteTasklistById);

export default router;
