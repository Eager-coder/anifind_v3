import { Router } from "express"
import authController from "../controllers/auth"
import { verifyAuth } from "../middlewares/auth"
import validation from "../middlewares/validation"
import asyncHandler from "../utils/async-handler"

const router = Router()

router.post("/register", validation.register, asyncHandler(authController.register))
router.post("/login", validation.login, asyncHandler(authController.login))
router.get("/verify/:token", asyncHandler(authController.verifyEmail))
router.post(
	"/resend-verification-link",
	validation.email,
	asyncHandler(authController.resendVerification)
)
router.post("/request-password-reset", asyncHandler(authController.requestPasswordReset))
router.post("/reset-password", asyncHandler(authController.resetPassword))
router.put("/password", verifyAuth, asyncHandler(authController.changePassword))
router.post("/refresh-token", asyncHandler(authController.refreshToken))
router.delete("/logout", verifyAuth, asyncHandler(authController.logout))
export default router
