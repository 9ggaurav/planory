import { Router } from "express";
import { createBoard } from "../controllers/board.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router: Router = Router();

router.route("/create").post(verifyJWT, createBoard);

export default router;
