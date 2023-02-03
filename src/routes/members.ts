import { Router } from "express"
import membersController from "../controllers/members"
import { checkAuth, verifyAuth } from "../middlewares/auth"
import asyncHandler from "../utils/async-handler"

const router = Router()

router.get("/", checkAuth, asyncHandler(membersController.getAll))
router.get("/:username", checkAuth, asyncHandler(membersController.get))
router.post("/follow/:username", verifyAuth, asyncHandler(membersController.follow))
router.delete("/follow/:username", verifyAuth, asyncHandler(membersController.unfollow))
export { router as membersRouter }
