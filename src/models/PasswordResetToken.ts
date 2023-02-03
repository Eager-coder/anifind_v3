import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"

const PasswordResetToken = {
	async insertOrReplace(user_id: string, token: string) {
		await pool.query(
			`INSERT INTO password_reset_tokens 
      (user_id, token, expires_at)
    VALUES 
      ($1, $2, $3) 
		ON CONFLICT (user_id) 
		DO UPDATE SET token = $2, expires_at = $3
		`,
			[user_id, token, getUnixTimeNow() + 7200]
		)
	},
	async findOne(user_id: string, token: string) {
		const { rows } = await pool.query(
			`
			SELECT * FROM password_reset_tokens 
			WHERE user_id = $1 AND token = $2`,
			[user_id, token]
		)
		return rows[0]
	},
	async delete(user_id: string) {
		await pool.query(
			`
			DELETE FROM password_reset_tokens 
			WHERE user_id = $1`,
			[user_id]
		)
	},
}

export default PasswordResetToken
