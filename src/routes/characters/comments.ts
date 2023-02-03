import { Router } from "express"
import characterCommentsController from "../../controllers/characters/comments"
import { verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router()

router.get("/user", verifyAuth, asyncHandler(characterCommentsController.getUser))
router.get("/:character_id", asyncHandler(characterCommentsController.get))
router.post("/:character_id", verifyAuth, asyncHandler(characterCommentsController.add))
router.put("/:comment_id", verifyAuth, asyncHandler(characterCommentsController.edit))
router.delete("/:comment_id", verifyAuth, asyncHandler(characterCommentsController.delete))

export { router as characterCommentsRouter }
