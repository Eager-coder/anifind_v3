import { Router } from "express"
import postsController from "../../controllers/discussions/posts"
import { checkAuth, verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router({ mergeParams: true })

router.get("/", checkAuth, asyncHandler(postsController.get))
router.post("/", verifyAuth, asyncHandler(postsController.create))
router.put("/:post_id", verifyAuth, asyncHandler(postsController.edit))
router.delete("/:post_id", verifyAuth, asyncHandler(postsController.delete))
router.post("/:post_id/like", verifyAuth, asyncHandler(postsController.like))
router.delete("/:post_id/like", verifyAuth, asyncHandler(postsController.unlike))
export { router as postsRouter }
