import { Router } from "express"
import favCharactersController from "../../controllers/characters/favorites"
import { verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router()

router.get("/", verifyAuth, asyncHandler(favCharactersController.getAll))
router.get(
	"/is-favorite/:character_id",
	verifyAuth,
	asyncHandler(favCharactersController.isFavorite)
)
router.post("/", verifyAuth, asyncHandler(favCharactersController.add))
router.delete("/:character_id", verifyAuth, asyncHandler(favCharactersController.delete))

export { router as favoriteCharactersRouter }
