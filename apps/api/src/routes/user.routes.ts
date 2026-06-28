import { Router } from "express";
import { registerUser, getUsers, loginUser, logoutUser } from "../controllers/user.controller";
import {upload} from "../middleware/multer.middleware"
import { verifyJWT } from "../middleware/auth.middleware";

const router: Router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

// router.route("/users").get(getUsers);

router.route("/login").post(loginUser);


// secured Routes
router.route("/users").get(verifyJWT, getUsers);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;