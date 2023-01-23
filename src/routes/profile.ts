import { Router } from "express"
import profileController from "../controllers/profile"
import { verifyAuth } from "../middlewares/auth"
import validation from "../middlewares/validation"
import asyncHandler from "../utils/async-handler"

const router = Router()

router.get("/", verifyAuth, asyncHandler(profileController.get))
router.get("/follows", verifyAuth, asyncHandler(profileController.getFollows))
router.get("/threads", verifyAuth, asyncHandler(profileController.getThreads))
router.put("/about", verifyAuth, asyncHandler(profileController.updateAbout))
router.put("/avatar", verifyAuth, asyncHandler(profileController.uploadAvatar))
router.put("/username", verifyAuth, asyncHandler(profileController.changeUsername))
export default router
