import pool from "../config/db"
import { v4 as uuidv4 } from "uuid"
import { getUnixTimeNow } from "../utils/getTime"
const User = {
	async register(username: string, email: string, hashedPassword: string) {
		const { rows } = await pool.query(
			`
    INSERT INTO 
      users (id, username, email, password, created_at)
    VALUES 
      ($1, $2, $3, $4, $5) 
    RETURNING * 
		`,
			[uuidv4(), username, email, hashedPassword, getUnixTimeNow()],
		)
		return rows[0]
	},

	async getByEmail(email: string) {
		const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
		return rows[0]
	},
	async getByUsername(username: string) {
		const { rows } = await pool.query(
			`
			SELECT 
				id, username, created_at, avatar_url, about 
			FROM users WHERE username = $1`,
			[username],
		)
		return rows[0]
	},
	async verify(id: string) {
		const result = await pool.query(`UPDATE users SET is_verified = TRUE WHERE id = $1`, [id])
		return result
	},
	async getProfile(id: string) {
		const { rows } = await pool.query(
			`
		SELECT 
			id, username, email, created_at, avatar_url, about 
		FROM 
			users
		WHERE id = $1`,
			[id],
		)
		return rows[0]
	},

	async getAll() {
		const { rows } = await pool.query(`SELECT id, username, avatar_url FROM users`)
		return rows
	},
	async updateAbout(id: string, new_about: string) {
		await pool.query(
			`
			UPDATE users SET about = $1
			WHERE id = $2
			`,
			[new_about, id],
		)
	},
	async updateAvatar(id: string, url: string) {
		await pool.query(
			`
			UPDATE users SET avatar_url = $1
			WHERE id = $2
			`,
			[url, id],
		)
	},
	async updateUsername(id: string, username: string) {
		await pool.query(
			`
			UPDATE users SET username = $1 
			WHERE id = $2`,
			[username, id],
		)
	},
	async updatePassword(id: string, password: string) {
		await pool.query(
			`
			UPDATE users SET password = $1 
			WHERE id = $2`,
			[password, id],
		)
	},
}

export default User
