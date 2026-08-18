import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { getOrCreateInboxTasklist } from "../controllers/inbox.controller";

const router: Router = Router();

router.route("/tasklist").get(verifyJWT, getOrCreateInboxTasklist);

export default router;
