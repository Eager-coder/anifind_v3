import { Request, Response } from "express"
import { InvalidDataException } from "../../error"
import FavAnimeService from "../../services/anime/favorites"

const favAnimeController = {
	async getAll(req: Request, res: Response) {
		const { id } = res.locals.user

		res.json({ data: await FavAnimeService.getAll(id) })
	},
	async isFavorite(req: Request, res: Response) {
		const { id } = res.locals.user
		const anime_id = Number(req.params.anime_id)
		res.json({ data: await FavAnimeService.isFavorite(anime_id, id) })
	},
	async delete(req: Request, res: Response) {
		const { id } = res.locals.user
		const anime_id = Number(req.params.anime_id)
		await FavAnimeService.delete(anime_id, id)
		res.json({ message: "Deleted from favorites" })
	},
	async add(req: Request, res: Response) {
		const { id } = res.locals.user
		const { anime_id, cover_image, title } = req.body
		if (!anime_id || !cover_image || !title) {
			throw new InvalidDataException("Data is incomplete")
		}
		await FavAnimeService.add(Number(anime_id), id, cover_image, title)
		res.json({ message: "Added to favorites" })
	},
}
export default favAnimeController
