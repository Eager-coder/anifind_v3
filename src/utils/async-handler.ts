import { RequestHandler, Request, Response, NextFunction } from "express"
import { apiError } from "../middlewares/api-error"

export default function asyncHandler(callback: RequestHandler) {
	return function (req: Request, res: Response, next: NextFunction) {
		Promise.resolve(callback(req, res, next)).catch(err => {
			apiError(err, req, res, next)
		})
	}
}
