import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"
interface FavCharacter {
	character_id: number
	user_id: string
	cover_image: string
	name: string
	created_at: number
}
const FavCharacters = {
	async getAll(user_id: string): Promise<FavCharacter[]> {
		const { rows } = await pool.query(
			`
    SELECT * FROM favorite_characters 
    WHERE user_id = $1 
    ORDER BY created_at DESC`,
			[user_id]
		)
		return rows
	},
	async getOne(character_id: number, user_id: string): Promise<FavCharacter> {
		const { rows } = await pool.query(
			`
    SELECT * FROM favorite_characters 
    WHERE character_id = $1 AND user_id = $2`,
			[character_id, user_id]
		)
		return rows[0]
	},
	async delete(character_id: number, user_id: string) {
		await pool.query(
			`
    DELETE FROM favorite_characters 
    WHERE character_id = $1 AND user_id = $2`,
			[character_id, user_id]
		)
	},
	async add({
		character_id,
		user_id,
		cover_image,
		name,
	}: {
		character_id: number
		user_id: string
		cover_image: string
		name: string
	}) {
		await pool.query(
			`
    INSERT INTO favorite_characters 
      (character_id, user_id, cover_image, name, created_at) 
    VALUES
      ($1, $2, $3, $4, $5) 
    ON CONFLICT (character_id, user_id) DO NOTHING
      `,
			[character_id, user_id, cover_image, name, getUnixTimeNow()]
		)
	},
}
export default FavCharacters
