import { Request, Response } from "express"
import { InvalidDataException, NotFoundException } from "../../error"
import Threads from "../../models/Threads"
import ThreadService from "../../services/discussions/threads"

const threadController = {
	async getAll(req: Request, res: Response) {
		res.json({ data: await ThreadService.getAll() })
	},

	async get(req: Request, res: Response) {
		const { thread_id } = req.params
		const user = res.locals.user
		const data = await ThreadService.get(thread_id, user)
		if (!data) {
			throw new NotFoundException("Thread does not exists")
		}
		res.json({ data })
	},

	async create(req: Request, res: Response) {
		const { topic, body } = req.body
		if (!topic || !body) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (topic.length > 250) {
			throw new InvalidDataException("Topic is too long")
		}
		if (body.length > 5000) {
			throw new InvalidDataException("Body is too long")
		}
		const thread_id = await ThreadService.create(res.locals.user.id, topic, body)
		res.status(201).json({ message: "Thread created", data: { thread_id } })
	},

	async edit(req: Request, res: Response) {
		const { thread_id } = req.params
		const { id } = res.locals.user
		const { topic, body } = req.body
		if (!topic || !body) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (topic.length > 250) {
			throw new InvalidDataException("Topic is too long")
		}
		if (body.length > 5000) {
			throw new InvalidDataException("Body is too long")
		}
		await ThreadService.edit(thread_id, id, topic, body)
		res.json({ message: "Thread edited" })
	},

	async delete(req: Request, res: Response) {
		const { thread_id } = req.params
		const { id } = res.locals.user
		const status = await ThreadService.delete(thread_id, id)
		res.json({ message: "Thread deleted", data: { status } })
	},

	async like(req: Request, res: Response) {
		const { thread_id } = req.params
		const { id } = res.locals.user

		await ThreadService.like(thread_id, id)
		res.json({ message: "Thread liked" })
	},

	async unlike(req: Request, res: Response) {
		const { thread_id } = req.params
		const { id } = res.locals.user
		await ThreadService.unlike(thread_id, id)
		res.json({ message: "Thread unliked" })
	},
}

export default threadController
