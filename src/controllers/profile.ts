import { Request, Response } from "express"
import { InvalidDataException } from "../error"
import ProfileService from "../services/profile"

const profileController = {
	async get(req: Request, res: Response) {
		const user = await ProfileService.get(res.locals.user.id)
		res.json({ data: user })
	},

	async updateAbout(req: Request, res: Response) {
		const { id } = res.locals.user
		const new_about = req.body?.new_about?.trim()

		if (typeof new_about === "string" && new_about.length > 3000) {
			throw new InvalidDataException("About is too long.")
		}
		await ProfileService.updateAbout(id, new_about)
		res.json({ message: "About has been updated." })
	},

	async uploadAvatar(req: Request, res: Response) {
		const { id } = res.locals.user
		const avatar = req.body?.avatar
		if (!avatar) {
			throw new InvalidDataException("Avatar not found")
		}
		const url = await ProfileService.uploadAvatar(id, avatar)
		res.json({ message: "Avatar has been updated", data: { url } })
	},
	async changeUsername(req: Request, res: Response) {
		const { id } = res.locals.user
		const new_username = req.body?.new_username?.trim()
		if (!new_username?.trim()) {
			throw new InvalidDataException("Please fill all the fields")
		}
		if (new_username.length < 2) {
			throw new InvalidDataException("Username must be more than 2 characters long")
		}
		if (new_username.length > 30) {
			throw new InvalidDataException("Username must be less than 30 characters long")
		}
		await ProfileService.changeUsername(id, new_username)
		res.json({ message: "Username has been updated" })
	},
	async getFollows(req: Request, res: Response) {
		const { id } = res.locals.user
		res.json({ data: await ProfileService.getFollows(id) })
	},
	async getThreads(req: Request, res: Response) {
		const { id } = res.locals.user
		res.json({ data: await ProfileService.getUserThreads(id) })
	},
}

export default profileController
