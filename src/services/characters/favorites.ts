import FavCharacters from "../../models/FavCharacters"

const FavCharactersService = {
	async getAll(user_id: string) {
		return await FavCharacters.getAll(user_id)
	},
	async isFavorite(character_id: number, user_id: string) {
		const row = await FavCharacters.getOne(character_id, user_id)
		return typeof row === "object"
	},
	async add(character_id: number, user_id: string, cover_image: string, name: string) {
		await FavCharacters.add({
			character_id,
			user_id,
			cover_image,
			name,
		})
	},
	async delete(character_id: number, user_id: string) {
		await FavCharacters.delete(character_id, user_id)
	},
}
export default FavCharactersService
