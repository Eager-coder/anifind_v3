import { Router } from "express"
import { animeRouter } from "./anime"
import authRouter from "./auth"
import { charactersRouter } from "./characters"
import { discussionsRouter } from "./discussions"
import { membersRouter } from "./members"
import { messagesRouter } from "./messages"

import profileRouter from "./profile"

const router = Router()

/*
https://anifind.com/api/auth/login 
*/

router.use("/auth", authRouter)
router.use("/profile", profileRouter)
router.use("/anime", animeRouter)
router.use("/characters", charactersRouter)
router.use("/members", membersRouter)
router.use("/discussions", discussionsRouter)
router.use("/messages", messagesRouter)

export default router
