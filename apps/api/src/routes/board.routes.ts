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

router.route("/boards").get(verifyJWT, getAllBoardsForLoggedInUser);  // return all boards for logged in user only
router.route("/create").post(verifyJWT, createBoard);
router.route("/all-boards").get(getAllPublicBoards);
router.route("/:boardId").get(getBoardById);
router.route("/user-boards").get(verifyJWT, userBoards);
router.route("/:boardId/update").put(verifyJWT, updateBoardDetails);
router
  .route("/:boardId/update-coverImage")
  .put(verifyJWT, upload.single("coverImage"), updateBoardCoverImage);
router.route("/:boardId/delete").delete(verifyJWT, deleteBoardById);

// Tasklist routes
router.route("/:boardId/tasklists").get(verifyJWT, getAllTasklists);
router.route("/:boardId/tasklists").post(verifyJWT, createTaskList);

export default router;
