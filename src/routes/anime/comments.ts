import { Router } from "express"
import animeCommentsController from "../../controllers/anime/comments"
import { verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router()

router.get("/user", verifyAuth, asyncHandler(animeCommentsController.getUser))
router.get("/:anime_id", asyncHandler(animeCommentsController.get))
router.post("/:anime_id", verifyAuth, asyncHandler(animeCommentsController.add))
router.put("/:anime_id", verifyAuth, asyncHandler(animeCommentsController.edit))
router.delete("/:anime_id", verifyAuth, asyncHandler(animeCommentsController.delete))

export { router as animeCommentsRouter }
