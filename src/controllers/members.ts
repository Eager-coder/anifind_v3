import { Request, Response } from "express"
import { InvalidDataException } from "../error"
import MembersService from "../services/members"

const membersController = {
	async get(req: Request, res: Response) {
		const { username } = req.params
		if (!username) {
			throw new InvalidDataException("Username is required")
		}
		const member = await MembersService.get(username)
		if (!member) {
			return res.status(404).json({ message: "User not found" })
		}
		if (res.locals.user.isLoggedIn) {
			member.is_followed = await MembersService.isFollowed(member.profile.id, res.locals.user.id)
		}
		res.json({ data: member })
	},

	async getAll(req: Request, res: Response) {
		res.json({ data: await MembersService.getAll() })
	},

	async follow(req: Request, res: Response) {
		const { id } = res.locals.user
		const { username } = req.params

		const member = await MembersService.getProfile(username)
		if (!member) {
			throw new InvalidDataException("User with that username does not exist")
		}
		await MembersService.follow(id, member.id)
		res.json({ message: `You are now following ${member.username}` })
	},

	async unfollow(req: Request, res: Response) {
		const { id } = res.locals.user
		const { username } = req.params
		const member = await MembersService.getProfile(username)
		if (!member) {
			throw new InvalidDataException("User with that username does not exist")
		}
		await MembersService.unfollow(id, member.id)
		res.json({ message: `${member.username} removed from followings` })
	},
}

export default membersController
