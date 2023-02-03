import { Request, Response } from "express"
import { InvalidDataException } from "../../error"
import FavCharactersService from "../../services/characters/favorites"

const favCharactersController = {
	async getAll(req: Request, res: Response) {
		const { id } = res.locals.user

		res.json({ data: await FavCharactersService.getAll(id) })
	},

	async isFavorite(req: Request, res: Response) {
		const { id } = res.locals.user
		const character_id = Number(req.params.character_id)
		res.json({ data: await FavCharactersService.isFavorite(character_id, id) })
	},

	async delete(req: Request, res: Response) {
		const { id } = res.locals.user
		const character_id = Number(req.params.character_id)
		await FavCharactersService.delete(character_id, id)
		res.json({ message: "Deleted from favorites" })
	},

	async add(req: Request, res: Response) {
		const { id } = res.locals.user
		const { character_id, cover_image, name } = req.body
		if (!character_id || !cover_image || !name) {
			throw new InvalidDataException("Data is incomplete")
		}
		await FavCharactersService.add(Number(character_id), id, cover_image, name)
		res.json({ message: "Added to favorites" })
	},
}

export default favCharactersController
