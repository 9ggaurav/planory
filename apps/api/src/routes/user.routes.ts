import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import {upload} from "../middleware/multer.middleware"

const router: Router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

export default router;