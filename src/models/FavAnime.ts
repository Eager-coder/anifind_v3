import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"

interface FavAnime {
	anime_id: number
	user_id: string
	cover_image: string
	title: string
	created_at: number
}

const FavAnime = {
	async getAll(user_id: string): Promise<FavAnime[]> {
		const { rows } = await pool.query(
			`
    SELECT * FROM favorite_anime 
    WHERE user_id = $1 
    ORDER BY created_at DESC`,
			[user_id],
		)
		return rows
	},
	async getOne(anime_id: number, user_id: string): Promise<FavAnime> {
		const { rows } = await pool.query(
			`
    SELECT * FROM favorite_anime 
    WHERE anime_id = $1 AND user_id = $2`,
			[anime_id, user_id],
		)
		return rows[0]
	},
	async delete(anime_id: number, user_id: string) {
		await pool.query(
			`
    DELETE FROM favorite_anime 
    WHERE anime_id = $1 AND user_id = $2`,
			[anime_id, user_id],
		)
	},
	async add({
		anime_id,
		user_id,
		cover_image,
		title,
	}: {
		anime_id: number
		user_id: string
		cover_image: string
		title: string
	}) {
		await pool.query(
			`
    INSERT INTO favorite_anime 
      (anime_id, user_id, cover_image, title, created_at) 
    VALUES
      ($1, $2, $3, $4, $5) 
    ON CONFLICT (anime_id, user_id) DO NOTHING
      `,
			[anime_id, user_id, cover_image, title, getUnixTimeNow()],
		)
	},
}
export default FavAnime
