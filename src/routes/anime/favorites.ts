import { Router } from "express"
import favAnimeController from "../../controllers/anime/favorites"
import { verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router()

router.get("/", verifyAuth, asyncHandler(favAnimeController.getAll))
router.get("/is-favorite/:anime_id", verifyAuth, asyncHandler(favAnimeController.isFavorite))
router.post("/", verifyAuth, asyncHandler(favAnimeController.add))
router.delete("/:anime_id", verifyAuth, asyncHandler(favAnimeController.delete))

export { router as favoriteAnimeRouter }
