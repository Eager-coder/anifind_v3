import pool from "../config/db"

interface RefreshToken {
	user_id: string
	token: string
}

const RefreshToken = {
	async insertOrReplace(user_id: string, token: string) {
		await pool.query(
			`
      INSERT INTO refresh_tokens 
        (user_id, token) 
      VALUES 
        ($1, $2) 
      ON CONFLICT (user_id, token) 
      DO UPDATE SET token = $2`,
			[user_id, token]
		)
	},
	async get(user_id: string, token: string): Promise<RefreshToken> {
		const { rows } = await pool.query(
			`
    SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2
    `,
			[user_id, token]
		)
		return rows[0]
	},
	async delete(token: string) {
		await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token])
	},
	async deleteById(user_id: string) {
		await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user_id])
	},
}
export default RefreshToken
