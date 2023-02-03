import { Request, Response } from "express"
import { InvalidDataException } from "../../error"
import CharacterCommentsService from "../../services/characters/comments"

const characterCommentsController = {
	async get(req: Request, res: Response) {
		const character_id = Number(req.params.character_id)
		if (!character_id) {
			throw new InvalidDataException("Character id is required")
		}
		res.json({ data: await CharacterCommentsService.get(character_id) })
	},

	async getUser(req: Request, res: Response) {
		const { id } = res.locals.user
		res.json({ data: await CharacterCommentsService.getUser(id) })
	},

	async add(req: Request, res: Response) {
		const { id } = res.locals.user
		const character_id = Number(req.params.character_id)
		const { text } = req.body
		if (!character_id || !text) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (text.length > 3000) {
			throw new InvalidDataException("Comment is too long")
		}
		await CharacterCommentsService.add({ character_id, user_id: id, text })
		res.json({ message: "Comment added" })
	},

	async edit(req: Request, res: Response) {
		const { id } = res.locals.user
		const { text } = req.body
		const { comment_id } = req.params
		if (!comment_id || !text) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (text.length > 3000) {
			throw new InvalidDataException("Comment is too long")
		}
		await CharacterCommentsService.edit({ comment_id, user_id: id, text })
		res.json({ message: "Comment edited" })
	},

	async delete(req: Request, res: Response) {
		const { id } = res.locals.user
		const { comment_id } = req.params

		if (!comment_id) {
			throw new InvalidDataException("Comment id is required")
		}
		await CharacterCommentsService.delete(comment_id, id)
		res.json({ message: "Comment deleted" })
	},
}

export default characterCommentsController
