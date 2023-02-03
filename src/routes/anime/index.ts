import { Router } from "express"
import { animeCommentsRouter } from "./comments"
import { favoriteAnimeRouter } from "./favorites"

const router = Router()

router.use("/favorites", favoriteAnimeRouter)
router.use("/comments", animeCommentsRouter)

export { router as animeRouter }
