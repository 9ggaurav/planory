import { Router } from "express";
import { registerUser, getUsers } from "../controllers/user.controller";
import {upload} from "../middleware/multer.middleware"

const router: Router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

router.route("/users").get(getUsers);

export default router;