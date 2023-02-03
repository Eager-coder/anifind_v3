import { Router } from "express"
import threadController from "../../controllers/discussions/threads"
import { checkAuth, verifyAuth } from "../../middlewares/auth"
import asyncHandler from "../../utils/async-handler"

const router = Router()
router.get("/", asyncHandler(threadController.getAll))
router.get("/:thread_id", checkAuth, asyncHandler(threadController.get))
router.post("/", verifyAuth, asyncHandler(threadController.create))
router.put("/:thread_id", verifyAuth, asyncHandler(threadController.edit))
router.delete("/:thread_id", verifyAuth, asyncHandler(threadController.delete))

router.post("/like/:thread_id", verifyAuth, asyncHandler(threadController.like))
router.delete("/like/:thread_id", verifyAuth, asyncHandler(threadController.unlike))
export { router as threadRouter }
