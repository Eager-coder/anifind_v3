import { NextFunction, Request, Response } from "express"
import { InvalidDataException } from "../error"
import asyncHandler from "../utils/async-handler"
import isValidEmail from "../utils/email-validation"

const register = asyncHandler((req: Request, res: Response, next: NextFunction) => {
	const [username, email, password] = [req.body.username?.trim(), req.body.email?.trim(), req.body.password?.trim()]

	if (!username || !email || !password) {
		throw new InvalidDataException("Please fill all the fields")
	}
	if (username.length < 2) {
		throw new InvalidDataException("Username must be more than 2 characters long")
	}
	if (username.length > 30) {
		throw new InvalidDataException("Username must be less than 30 characters long")
	}
	if (username.split(" ").length > 1) {
		throw new InvalidDataException("No whitespace allowed for username")
	}
	if (!isValidEmail(email)) {
		throw new InvalidDataException("Email is not valid")
	}
	if (password?.length < 8) {
		throw new InvalidDataException("Password must be at least 8 characters long")
	}
	if (password?.length > 255) {
		throw new InvalidDataException("Password must be lower than 255 characters long")
	}
	next()
})
const login = asyncHandler((req: Request, res: Response, next: NextFunction) => {
	const [email, password] = [req.body?.email?.trim(), req.body?.password?.trim()]
	if (!email || !password) {
		throw new InvalidDataException("Please fill all the fields")
	}
	if (!isValidEmail(email)) {
		throw new InvalidDataException("Email is invalid")
	}
	next()
})

const email = asyncHandler((req: Request, res: Response, next: NextFunction) => {
	const email = req.body.email
	if (!isValidEmail(email)) {
		throw new InvalidDataException("Email is invalid.")
	}
	next()
})
const about = asyncHandler((req: Request, res: Response, next: NextFunction) => {
	const new_about = req.body?.new_about?.trim()

	if (new_about.length > 3000) {
		throw new InvalidDataException("About is too long.")
	}
	next()
})

const validation = {
	register,
	email,
	login,
	about,
}
export default validation
