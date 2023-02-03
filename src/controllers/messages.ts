import { Request, Response } from "express"
import { InvalidDataException } from "../error"
import Chats from "../models/Chats"

const messagesController = {
	async getAll(req: Request, res: Response) {
		const messages = await Chats.getMessages(res.locals.user.id)
		res.json({ data: messages })
	},

	async createChat(req: Request, res: Response) {
		const { id } = res.locals.user
		const { recipient_id } = req.body
		const chat_id = await Chats.createChat(id, recipient_id)
		res.json({ data: chat_id })
	},

	async getChat(req: Request, res: Response) {
		const { id } = res.locals.user
		const { recipient_id } = req.params
		if (!recipient_id) {
			throw new InvalidDataException("Recipient id is required")
		}
		const chat = await Chats.getChat(id, recipient_id.toString())
		res.json({ data: chat })
	},
}

export default messagesController
