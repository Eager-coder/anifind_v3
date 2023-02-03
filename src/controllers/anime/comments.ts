import { Request, Response } from "express"
import { InvalidDataException } from "../../error"
import AnimeCommentsService from "../../services/anime/comments"

const animeCommentsController = {
	async get(req: Request, res: Response) {
		const anime_id = Number(req.params.anime_id)
		if (!anime_id) {
			throw new InvalidDataException("Anime id is required")
		}
		res.json({ data: await AnimeCommentsService.get(anime_id) })
	},
	async getUser(req: Request, res: Response) {
		const { id } = res.locals.user
		res.json({ data: await AnimeCommentsService.getUser(id) })
	},
	async add(req: Request, res: Response) {
		const { id } = res.locals.user
		const anime_id = Number(req.params.anime_id)
		const { text } = req.body
		if (!anime_id || !text) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (text.length > 3000) {
			throw new InvalidDataException("Comment is too long")
		}
		await AnimeCommentsService.add({ anime_id, user_id: id, text })
		res.json({ message: "Comment added" })
	},
	async edit(req: Request, res: Response) {
		const { id } = res.locals.user
		const { comment_id, text } = req.body
		if (!comment_id || !text) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (text.length > 3000) {
			throw new InvalidDataException("Comment is too long")
		}
		await AnimeCommentsService.edit({ comment_id, user_id: id, text })
		res.json({ message: "Comment edited" })
	},
	async delete(req: Request, res: Response) {
		const { id } = res.locals.user
		const { comment_id } = req.body
		if (!comment_id) {
			throw new InvalidDataException("Comment id is required")
		}
		await AnimeCommentsService.delete(comment_id, id)
		res.json({ message: "Comment deleted" })
	},
}

export default animeCommentsController
