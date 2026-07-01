import { Router } from "express";
import {
  createBoard,
  getAllPublicBoards,
  getBoardById,
  userBoards,
  updateBoardDetails,
  updateBoardCoverImage,
  deleteBoardById
} from "../controllers/board.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router: Router = Router();

router.route("/create").post(verifyJWT, createBoard);
router.route("/all-boards").get(getAllPublicBoards);
router.route("/board/:boardId").get(getBoardById);
router.route("/user-boards").get(verifyJWT, userBoards);
router.route("/update-board/:boardId").put(verifyJWT, updateBoardDetails);
router.route("/update-coverImage/:boardId").put(verifyJWT, upload.single("coverImage"), updateBoardCoverImage);
router.route("/delete/:boardId").delete(verifyJWT, deleteBoardById);

export default router;
