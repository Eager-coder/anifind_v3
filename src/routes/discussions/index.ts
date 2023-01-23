import { Router } from "express"
import { postsRouter } from "./posts"
import { threadRouter } from "./threads"

const router = Router()

router.use("/threads", threadRouter)
router.use("/threads/:thread_id/posts", postsRouter)

export { router as discussionsRouter }
