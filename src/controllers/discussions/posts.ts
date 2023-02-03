import { Request, Response } from "express"
import { InvalidDataException } from "../../error"
import PostsService from "../../services/discussions/posts"

const postsController = {
	async get(req: Request, res: Response) {
		const { thread_id } = req.params
		const { user } = res.locals

		res.json({ data: await PostsService.get(thread_id, user) })
	},

	async create(req: Request, res: Response) {
		const { thread_id } = req.params
		const { body, parent_id } = req.body
		const { id } = res.locals.user
		if (!body?.trim()) {
			throw new InvalidDataException("Post cannot be blank")
		}
		if (body.length > 5000) {
			throw new InvalidDataException("Post is too long")
		}
		await PostsService.create(thread_id, id, parent_id, body)
		res.status(201).json({ message: "Post created" })
	},

	async edit(req: Request, res: Response) {
		const { thread_id, post_id } = req.params
		const { body } = req.body
		const { id } = res.locals.user
		if (!body?.trim()) {
			throw new InvalidDataException("Post cannot be blank")
		}
		if (body.length > 5000) {
			throw new InvalidDataException("Post is too long")
		}
		await PostsService.edit(post_id, thread_id, id, body)
		res.json({ message: "Post edited" })
	},

	async delete(req: Request, res: Response) {
		const { post_id } = req.params
		const { id } = res.locals.user
		await PostsService.delete(post_id, id)
		res.json({ message: "Post deleted" })
	},

	async like(req: Request, res: Response) {
		const { post_id } = req.params
		const { id } = res.locals.user
		await PostsService.like(post_id, id)
		res.json({ message: "Post liked" })
	},

	async unlike(req: Request, res: Response) {
		const { post_id } = req.params
		const { id } = res.locals.user
		await PostsService.unlike(post_id, id)
		res.json({ message: "Post unliked" })
	},
}

export default postsController
