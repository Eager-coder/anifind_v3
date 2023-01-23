import { InvalidDataException, NotFoundException } from "../../error"
import Posts from "../../models/Posts"
import Threads from "../../models/Threads"
import getNestedPosts from "../../utils/getNestedPosts"

const PostsService = {
	async get(thread_id: string, user: { isLoggedIn: boolean; id: string }) {
		if (user.isLoggedIn) {
			return getNestedPosts(await Posts.getWithAuth(thread_id, user.id))
		} else {
			return getNestedPosts(await Posts.getWithoutAuth(thread_id))
		}
	},
	async create(thread_id: string, user_id: string, parent_id: string | null, body: string) {
		const thread = await Threads.getOneWithoutAuth(thread_id)
		if (thread.is_deleted) {
			throw new InvalidDataException("Cannot post on deleted thread")
		}
		await Posts.create(thread_id, user_id, parent_id || null, body)
	},
	async edit(post_id: string, thread_id: string, user_id: string, body: string) {
		const thread = await Threads.getOneWithoutAuth(thread_id)
		if (thread.is_deleted) {
			throw new InvalidDataException("Cannot edit post on deleted thread")
		}
		const post = await Posts.getUserPosts(post_id, user_id)
		if (!post) {
			throw new NotFoundException("Post not found")
		}
		await Posts.edit(post_id, body)
	},
	async delete(post_id: string, user_id: string) {
		const post = await Posts.getUserPosts(post_id, user_id)
		if (!post) {
			throw new NotFoundException("Post does not exist")
		}
		const hasParent = await Posts.hasParent(post_id)

		if (hasParent) {
			await Posts.softDelete(post_id)
		} else {
			await Posts.hardDelete(post_id)
		}
	},
	async like(post_id: string, user_id: string) {
		await Posts.like(post_id, user_id)
	},
	async unlike(post_id: string, user_id: string) {
		await Posts.unlike(post_id, user_id)
	},
}
export default PostsService
