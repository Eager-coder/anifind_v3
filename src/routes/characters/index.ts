import { Router } from "express"
import { characterCommentsRouter } from "./comments"
import { favoriteCharactersRouter } from "./favorites"

const router = Router()

router.use("/favorites", favoriteCharactersRouter)
router.use("/comments", characterCommentsRouter)

export { router as charactersRouter }
