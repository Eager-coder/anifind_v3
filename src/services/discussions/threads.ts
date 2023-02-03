import { InvalidDataException, NotFoundException } from "../../error"
import Posts from "../../models/Posts"
import Threads from "../../models/Threads"

const ThreadService = {
	async getAll() {
		return await Threads.getAll()
	},
	async get(thread_id: string, user: { isLoggedIn: boolean; id: string }) {
		let data
		if (user.isLoggedIn) {
			data = await Threads.getOneWithAuth(thread_id, user.id)
		} else {
			data = await Threads.getOneWithoutAuth(thread_id)
		}
		return data
	},

	async create(user_id: string, topic: string, body: string) {
		return await Threads.create(user_id, topic, body)
	},

	async edit(thread_id: string, user_id: string, topic: string, body: string) {
		const thread = await Threads.getOneWithAuth(thread_id, user_id)
		if (!thread) {
			throw new NotFoundException("Thread not found")
		}
		if (thread.is_deleted) {
			throw new InvalidDataException("Cannot edit deleted thread")
		}
		await Threads.edit(thread_id, user_id, topic, body)
	},

	async delete(thread_id: string, user_id: string): Promise<"hard_delete" | "soft_delete"> {
		const thread = await Threads.getOneWithUserId(thread_id, user_id)
		if (!thread) {
			throw new NotFoundException("Thread does not exist")
		}

		const post = await Posts.getOneByThreadId(thread_id)

		if (post) {
			await Threads.softDelete(thread_id, user_id)
			return "soft_delete"
		} else {
			await Threads.hardDelete(thread_id, user_id)
			return "hard_delete"
		}
	},

	async like(thread_id: string, user_id: string) {
		const thread = await Threads.getOne(thread_id)
		if (!thread) {
			throw new NotFoundException("Thread not found")
		}

		await Threads.like(thread_id, user_id)
	},

	async unlike(thread_id: string, user_id: string) {
		const thread = await Threads.getOne(thread_id)
		if (!thread) {
			throw new NotFoundException("Thread not found")
		}
		await Threads.unlike(thread_id, user_id)
	},
}
export default ThreadService
