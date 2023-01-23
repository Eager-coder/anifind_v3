import bcrypt, { compare } from "bcrypt"
import { AlreadyExistsExceprion, InvalidDataException, NotFoundException, UnauthorizedException } from "../error"
import VerificationToken from "../models/VerificationToken"
import User from "../models/User"
import sendEmail from "../utils/email-sender"
import crypto from "crypto"
import { getUnixTimeNow } from "../utils/getTime"
import { generateTokens } from "../utils/generateTokens"
import RefreshToken from "../models/RefreshToken"
import PasswordResetToken from "../models/PasswordResetToken"
import { verify } from "jsonwebtoken"

interface UserData {
	id: string
	username: string
	email: string
	password: string
	is_verified: boolean
	created_at: Date
	avatar_url: string | null
	about: string | null
}
const AuthService = {
	async register({ username, email, password }: UserData) {
		const existingUsername = await User.getByUsername(username)
		if (existingUsername) {
			throw new AlreadyExistsExceprion("A user with that username already exists")
		}
		const existingEmail = await User.getByEmail(email)
		if (existingEmail) {
			throw new AlreadyExistsExceprion("A user with that email already exists")
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		const user: UserData = await User.register(username, email, hashedPassword)
		return user
	},

	async login({ email, password }: UserData) {
		const user = await User.getByEmail(email)
		if (!user) {
			throw new InvalidDataException("Email or password is incorrect")
		}
		const isMatch = await compare(password, user.password)
		if (!isMatch) {
			throw new InvalidDataException("Email or password is incorrect")
		}

		if (!user.is_verified) {
			throw new UnauthorizedException("Email is not verified.")
		}
		const { access_token, refresh_token } = generateTokens(user.id)
		await RefreshToken.insertOrReplace(user.id, refresh_token)
		return { access_token, refresh_token }
	},

	async sendEmailVerification(email: string, user_id: string, baseUrl: string) {
		const token = crypto.randomBytes(20).toString("hex")
		await VerificationToken.insertOrReplace(user_id, token)
		const subject = "AniFind user verification"
		const text = "Please use the link below to verify your email"
		const html = `
		<h1>Thanks for registering for AniFind!</h1>
		<a href="${baseUrl}/verify-email/${token}">Click here to verify your account</a>
		`
		await sendEmail(email, subject, text, html)
	},

	async resendEmailVerification(email: string, baseUrl: string) {
		const user = await User.getByEmail(email)
		if (!user) {
			throw new NotFoundException("No user found with this email.")
		}
		if (user.is_verified) {
			throw new AlreadyExistsExceprion("You are already verified.")
		}
		await this.sendEmailVerification(email, user.id, baseUrl)
	},

	async verify(token: string) {
		const existingToken = await VerificationToken.get(token)
		if (!existingToken) {
			throw new NotFoundException("Verification token not found.")
		}
		if (existingToken.expires_at < getUnixTimeNow()) {
			throw new InvalidDataException("Verification token has already expired. Please re-issue verification token.")
		}
		await User.verify(existingToken.user_id)
		await VerificationToken.delete(existingToken.user_id)
	},
	async requestPasswordReset(email: string, baseUrl: string) {
		const user = await User.getByEmail(email)
		if (!user) return
		const token = crypto.randomBytes(20).toString("hex")
		await PasswordResetToken.insertOrReplace(user.id, token)

		await sendEmail(
			email,
			"AniFind password reset",
			"Please use the link below to reset your password",
			`
		<h1>Reset password</h1>
		<a href="${baseUrl}/reset-password?id=${user.id}&token=${token}">Click here to reset your password</a>
		`,
		)
	},
	async resetPassword(id: string, token: string, new_password: string) {
		const user = await User.getProfile(id)
		if (!user) {
			throw new NotFoundException("Invalid credentials")
		}
		const tokenData = await PasswordResetToken.findOne(user.id, token)
		if (!tokenData) {
			throw new NotFoundException("Token was not found. Please re-issue password reset link")
		}
		if (tokenData.expires_at < getUnixTimeNow()) {
			throw new NotFoundException("The link has expired. Please re-issue password reset link")
		}
		const hashedPassword = await bcrypt.hash(new_password, 10)
		await User.updatePassword(user.id, hashedPassword)
		await PasswordResetToken.delete(user.id)
		await RefreshToken.deleteById(user.id)
	},

	async changePassword(user_id: string, new_password: string) {
		const hashedPassword = await bcrypt.hash(new_password, 10)

		await User.updatePassword(user_id, hashedPassword)
		await RefreshToken.deleteById(user_id)
	},
	async refreshToken(old_token: string) {
		try {
			const user: any = verify(old_token, process.env.REFRESH_TOKEN_SECRET!)
			const existing = await RefreshToken.get(user.id, old_token)
			if (!existing) {
				throw new UnauthorizedException("Please log in to continue")
			}
			const { access_token, refresh_token } = generateTokens(user.id)
			await RefreshToken.insertOrReplace(user.id, refresh_token)
			return { access_token, refresh_token }
		} catch (error) {
			throw new UnauthorizedException("Please log in to continue")
		}
	},
	async logout(refresh_token: string) {
		await RefreshToken.delete(refresh_token)
	},
}

export default AuthService
