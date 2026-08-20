import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { getInboxTasks, createInboxTask } from "../controllers/inbox.controller";

const router: Router = Router();

router.route("/tasks").get(verifyJWT, getInboxTasks);
router.route("/tasks").post(verifyJWT, createInboxTask);

export default router;