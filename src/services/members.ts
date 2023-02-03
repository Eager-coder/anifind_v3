import FavAnime from "../models/FavAnime"
import FavCharacters from "../models/FavCharacters"
import Follows from "../models/Follows"
import Threads from "../models/Threads"
import User from "../models/User"

interface Member {
	profile: any
	favorite_anime: Array<{}>
	favorite_characters: Array<{}>
	followers: Array<{}>
	followings: Array<{}>
	threads: Array<{}>
	is_followed?: boolean
}

const MembersService = {
	async get(username: string): Promise<Member | null> {
		const profile = await User.getByUsername(username)
		if (!profile) return null
		const favorite_anime = await FavAnime.getAll(profile.id)
		const favorite_characters = await FavCharacters.getAll(profile.id)
		const followers = await Follows.getFollowers(profile.id)
		const followings = await Follows.getFollowings(profile.id)
		const threads = await Threads.getUserThreads(profile.id)
		return { profile, favorite_anime, favorite_characters, followers, followings, threads }
	},

	async getAll() {
		return await User.getAll()
	},

	async getProfile(username: string) {
		return await User.getByUsername(username)
	},

	async isFollowed(followed_id: string, follower_id: string) {
		return await Follows.isFollowed(followed_id, follower_id)
	},

	async follow(follower_id: string, followed_id: string) {
		await Follows.follow(follower_id, followed_id)
	},

	async unfollow(follower_id: string, followed_id: string) {
		await Follows.unfollow(follower_id, followed_id)
	},
}

export default MembersService
