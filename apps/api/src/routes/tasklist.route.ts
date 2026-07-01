import { verifyJWT } from "../middleware/auth.middleware";
import { createTaskList } from "../controllers/tasklist.controller";
import { Router } from "express";

const router: Router = Router();

router.route("/:boardId/create-tasklist").post(verifyJWT, createTaskList);

export default router;
