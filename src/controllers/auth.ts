import { Request, Response } from "express"
import { InvalidDataException, UnauthorizedException } from "../error"
import AuthService from "../services/auth"
import isValidEmail from "../utils/email-validation"
import { getCookieExpDate } from "../utils/getTime"

const authController = {
	async register(req: Request, res: Response) {
		const user = await AuthService.register(req.body)
		const baseUrl = req.protocol + "://" + req.get("host") + (process.env.NODE_ENV === "production" ? "" : ":3000")
		await AuthService.sendEmailVerification(user.email, user.id, baseUrl)

		res.status(201).json({ message: "You are registered!" })
	},

	async verifyEmail(req: Request, res: Response) {
		const token = req.params.token
		await AuthService.verify(token)
		res.json({ message: "Your email has been verified" })
	},

	async login(req: Request, res: Response) {
		const { access_token, refresh_token } = await AuthService.login(req.body)
		res
			.cookie("refresh_token", refresh_token, {
				maxAge: 86400 * 14 * 1000,
				sameSite: "strict",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production" && true,
			})
			.cookie("access_token", access_token, {
				sameSite: "strict",
				secure: process.env.NODE_ENV! === "production" && true,
				httpOnly: true,
			})
			.json({ message: "Welcome back!" })
	},

	async resendVerification(req: Request, res: Response) {
		const email = req.body.email
		const baseUrl = req.protocol + "://" + req.get("host") + (process.env.NODE_ENV === "production" ? "" : ":3000")

		await AuthService.resendEmailVerification(email, baseUrl)
		res.json({ message: "Verification link has sent. Check your email." })
	},

	async requestPasswordReset(req: Request, res: Response) {
		const email = req.body.email?.trim()
		const baseUrl = req.protocol + "://" + req.get("host") + (process.env.NODE_ENV === "production" ? "" : ":3000")

		if (!isValidEmail(email)) {
			throw new InvalidDataException("Email is invalid")
		}
		await AuthService.requestPasswordReset(email, baseUrl)
		res.json({ message: "Password reset link has been sent to your email" })
	},

	async resetPassword(req: Request, res: Response) {
		const { id, token, new_password } = req.body

		if (!id || !token || !new_password) {
			throw new InvalidDataException("Invalid credentials")
		}
		if (new_password?.length < 8) {
			throw new InvalidDataException("Password must be at least 8 characters long")
		}
		if (new_password?.length > 255) {
			throw new InvalidDataException("Password must be lower than 255 characters long")
		}
		await AuthService.resetPassword(id, token, new_password)
		res.json({ message: "Your password has been reset" })
	},

	async changePassword(req: Request, res: Response) {
		const { id } = res.locals.user
		const new_password = req.body?.new_password?.trim()

		if (!new_password || new_password?.length < 8) {
			throw new InvalidDataException("Password must be at least 8 characters long")
		}
		if (new_password?.length > 255) {
			throw new InvalidDataException("Password must be lower than 255 characters long")
		}
		await AuthService.changePassword(id, new_password)
		res.json({ message: "Password has been changed" })
	},

	async refreshToken(req: Request, res: Response) {
		const token = req.cookies?.refresh_token
		const { access_token, refresh_token } = await AuthService.refreshToken(token)
		res
			.cookie("refresh_token", refresh_token, {
				maxAge: 86400 * 14 * 1000,
				sameSite: "strict",
				expires: getCookieExpDate(),
				secure: process.env.NODE_ENV! === "production" && true,
				httpOnly: true,
			})
			.cookie("access_token", access_token, {
				maxAge: 3000,
				sameSite: "strict",
				secure: process.env.NODE_ENV! === "production" && true,
				httpOnly: true,
			})
			.json({ message: "Access token has been refreshed" })
	},

	async logout(req: Request, res: Response) {
		const token = req.cookies?.refresh_token
		await AuthService.logout(token)
		res.clearCookie("refresh_token").clearCookie("access_token").json({ message: "You are logged out" })
	},
}

export default authController
