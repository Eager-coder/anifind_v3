import CharacterComments from "../../models/CharacterComments"

const CharacterCommentsService = {
	async get(character_id: number) {
		return await CharacterComments.get(character_id)
	},
	async getUser(user_id: string) {
		return await CharacterComments.getUser(user_id)
	},
	async add({
		character_id,
		user_id,
		text,
	}: {
		character_id: number
		user_id: string
		text: string
	}) {
		await CharacterComments.add({ character_id, user_id, text })
	},
	async edit({ comment_id, user_id, text }: { comment_id: string; user_id: string; text: string }) {
		await CharacterComments.update({ comment_id, user_id, text })
	},
	async delete(comment_id: string, user_id: string) {
		await CharacterComments.delete(comment_id, user_id)
	},
}

export default CharacterCommentsService
