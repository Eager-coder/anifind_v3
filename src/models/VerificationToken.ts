import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"
const VerificationToken = {
	async insertOrReplace(user_id: string, token: string) {
		await pool.query(
			`INSERT INTO verification_tokens 
      (user_id, token, expires_at)
    VALUES 
      ($1, $2, $3) 
		ON CONFLICT (user_id) 
		DO UPDATE SET token = $2, expires_at = $3
		`,
			[user_id, token, getUnixTimeNow() + 7200]
		)
	},
	async get(token: string) {
		const { rows } = await pool.query(
			`
    SELECT * FROM verification_tokens
    WHERE token = $1`,
			[token]
		)
		return rows[0]
	},
	async delete(user_id: string) {
		await pool.query(`DELETE FROM verification_tokens WHERE user_id = $1`, [user_id])
	},
}

export default VerificationToken
