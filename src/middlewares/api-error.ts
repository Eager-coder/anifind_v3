import { NextFunction, Request, Response } from "express"
import { AlreadyExistsExceprion, NotFoundException, UnauthorizedException, InvalidDataException } from "../error"

export const apiError = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err)

	if (err instanceof NotFoundException) {
		res.status(404).json({ message: err.message })
	} else if (err instanceof UnauthorizedException) {
		res.status(401).json({ message: err.message })
	} else if (err instanceof AlreadyExistsExceprion) {
		res.status(400).json({ message: err.message })
	} else if (err instanceof InvalidDataException) {
		res.status(400).json({ message: err.message })
	} else {
		res.status(500).json({ message: "Oops! Something went wrong." })
	}
}
