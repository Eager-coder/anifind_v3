import { sign } from "jsonwebtoken"
import { config } from "dotenv"
config()

export const generateTokens = (id: string) => {
	const access_token = sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "5m",
	})
	const refresh_token = sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: "14d",
	})

	return { access_token, refresh_token }
}
