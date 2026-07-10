import { Router } from "express";
import {
  getAllBoardsForLoggedInUser,
  createBoard,
  getAllPublicBoards,
  getBoardById,
  userBoards,
  updateBoardDetails,
  updateBoardCoverImage,
  deleteBoardById,
  getAllTasklists,
  createTaskList,
} from "../controllers/board.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router: Router = Router();

router.route("/user-boards").get(verifyJWT, getAllBoardsForLoggedInUser); // return all boards for logged in user only
router.route("/boards").post(verifyJWT,upload.single("coverImage"), createBoard);
router.route("/boards").get(getAllPublicBoards);
router.route("/:boardId").get(getBoardById);
router.route("/:boardId").patch(verifyJWT, updateBoardDetails);

router
  .route("/:boardId/coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateBoardCoverImage);

router.route("/:boardId").delete(verifyJWT, deleteBoardById);

// Tasklist routes
router.route("/:boardId/tasklists").get(verifyJWT, getAllTasklists);
router.route("/:boardId/tasklists").post(verifyJWT, createTaskList);

export default router;
