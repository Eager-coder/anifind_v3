import AnimeComments from "../../models/AnimeComments"

const AnimeCommentsService = {
	async get(anime_id: number) {
		return await AnimeComments.get(anime_id)
	},
	async getUser(user_id: string) {
		return await AnimeComments.getUser(user_id)
	},
	async add({ anime_id, user_id, text }: { anime_id: number; user_id: string; text: string }) {
		await AnimeComments.add({ anime_id, user_id, text })
	},
	async edit({ comment_id, user_id, text }: { comment_id: string; user_id: string; text: string }) {
		await AnimeComments.update({ comment_id, user_id, text })
	},
	async delete(comment_id: string, user_id: string) {
		await AnimeComments.delete(comment_id, user_id)
	},
}

export default AnimeCommentsService
