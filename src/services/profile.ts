import cloudinary from "../config/cloudinary"
import { AlreadyExistsExceprion } from "../error"
import Follows from "../models/Follows"
import Threads from "../models/Threads"
import User from "../models/User"

const ProfileService = {
	async get(id: string) {
		return await User.getProfile(id)
	},
	async updateAbout(id: string, new_about: string) {
		await User.updateAbout(id, new_about)
	},
	async uploadAvatar(id: string, avatar: string) {
		const { url } = await cloudinary.uploader.upload(avatar, {
			folder: "anifind/user",
			width: 400,
			height: 400,
			quality: "auto",
			fetch_format: "auto",
			crop: "scale",
		})
		await User.updateAvatar(id, url)
		return url
	},
	async changeUsername(id: string, new_username: string) {
		const user = await User.getByUsername(new_username)
		if (user) {
			throw new AlreadyExistsExceprion("A user with that username already exists")
		}
		await User.updateUsername(id, new_username)
	},
	async getFollows(id: string) {
		const followers = await Follows.getFollowers(id)
		const followings = await Follows.getFollowings(id)
		return { followers, followings }
	},
	async getUserThreads(user_id: string) {
		return await Threads.getUserThreads(user_id)
	},
}
export default ProfileService
