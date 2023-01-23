import FavCharacters from "../../models/FavAnime"

const FavAnimeService = {
	async getAll(user_id: string) {
		return await FavCharacters.getAll(user_id)
	},
	async isFavorite(anime_id: number, user_id: string) {
		const row = await FavCharacters.getOne(anime_id, user_id)
		return typeof row === "object"
	},
	async add(anime_id: number, user_id: string, cover_image: string, title: string) {
		await FavCharacters.add({
			anime_id,
			user_id,
			cover_image,
			title,
		})
	},
	async delete(anime_id: number, user_id: string) {
		await FavCharacters.delete(anime_id, user_id)
	},
}
export default FavAnimeService
