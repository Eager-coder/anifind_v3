import { Router } from "express"
import { verifyAuth } from "../middlewares/auth"
import asyncHandler from "../utils/async-handler"
import messagesController from "../controllers/messages"

const router = Router()

router.get("/", verifyAuth, asyncHandler(messagesController.getAll))
router.post("/", verifyAuth, asyncHandler(messagesController.createChat))
router.get("/:recipient_id", verifyAuth, asyncHandler(messagesController.getChat))

export { router as messagesRouter }
