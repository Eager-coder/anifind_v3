import pool from "../config/db"
import { v4 as uuidv4 } from "uuid"
import { getUnixTimeNow } from "../utils/getTime"

interface AnimeComment {
	comment_id: string
	anime_id: number
	user_id: string
	text: string
	created_at: number
	is_edited: boolean
}

const AnimeComments = {
	async get(anime_id: number): Promise<AnimeComment[]> {
		const { rows } = await pool.query(
			`
    SELECT
        anime_comments.*,
        avatar_url,
        username
    FROM
        anime_comments
        LEFT JOIN users ON users.id = anime_comments.user_id
    WHERE
        anime_comments.anime_id = $1
    ORDER BY
        anime_comments.created_at DESC   
    `,
			[anime_id],
		)
		return rows
	},
	async getUser(user_id: string): Promise<AnimeComment[]> {
		const { rows } = await pool.query(
			`
    SELECT
        anime_comments.*,
        avatar_url,
        username
    FROM
        anime_comments
        LEFT JOIN users ON users.id = anime_comments.user_id
    WHERE
        anime_comments.user_id = $1
    ORDER BY
        anime_comments.created_at DESC
    `,
			[user_id],
		)
		return rows
	},
	async add({ anime_id, user_id, text }: { anime_id: number; user_id: string; text: string }) {
		await pool.query(
			`
    INSERT INTO
        anime_comments (comment_id, anime_id, user_id, text, created_at)
    VALUES
        ($1, $2, $3, $4, $5) 
    `,
			[uuidv4(), anime_id, user_id, text, getUnixTimeNow()],
		)
	},
	async update({ comment_id, user_id, text }: { comment_id: string; user_id: string; text: string }) {
		await pool.query(
			`
    UPDATE
        anime_comments
    SET
        text = $1,
        is_edited = true
    WHERE
        comment_id = $2
        AND user_id = $3  
    `,
			[text, comment_id, user_id],
		)
	},
	async delete(comment_id: string, user_id: string) {
		await pool.query(
			`
    DELETE FROM anime_comments 
    WHERE comment_id = $1 AND user_id = $2`,
			[comment_id, user_id],
		)
	},
}

export default AnimeComments
