import { Router } from "express";
import {
  registerUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getAllBoards,
} from "../controllers/user.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/", (req, res) => {
  console.log("Route reached");
  res.send("ok");
});
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secured Routes
router.route("/users").get(verifyJWT, getUsers);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/reset-password").post(verifyJWT, changeCurrentPassword);
router.route("/me").get(verifyJWT, getCurrentUser);

// board routes
router.route("/:userId/boards").get(verifyJWT, getAllBoards);

export default router;
