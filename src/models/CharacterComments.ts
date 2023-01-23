import pool from "../config/db"
import { v4 as uuidv4 } from "uuid"
import { getUnixTimeNow } from "../utils/getTime"

interface CharacterComment {
	comment_id: string
	character_id: number
	user_id: string
	text: string
	created_at: number
	is_edited: boolean
}

const CharacterComments = {
	async get(character_id: number): Promise<CharacterComment[]> {
		const { rows } = await pool.query(
			`
    SELECT
        character_comments.*,
        avatar_url,
        username
    FROM
        character_comments
        LEFT JOIN users ON users.id = character_comments.user_id
    WHERE
        character_comments.character_id = $1
    ORDER BY
        character_comments.created_at DESC   
    `,
			[character_id],
		)
		return rows
	},
	async getUser(user_id: string): Promise<CharacterComment[]> {
		const { rows } = await pool.query(
			`
    SELECT
        character_comments.*,
        avatar_url,
        username
    FROM
        character_comments
        LEFT JOIN users ON users.id = character_comments.user_id
    WHERE
        character_comments.user_id = $1
    ORDER BY
        character_comments.created_at DESC
    `,
			[user_id],
		)
		return rows
	},
	async add({ character_id, user_id, text }: { character_id: number; user_id: string; text: string }) {
		await pool.query(
			`
    INSERT INTO
        character_comments (comment_id, character_id, user_id, text, created_at)
    VALUES
        ($1, $2, $3, $4, $5) 
    `,
			[uuidv4(), character_id, user_id, text, getUnixTimeNow()],
		)
	},
	async update({ comment_id, user_id, text }: { comment_id: string; user_id: string; text: string }) {
		await pool.query(
			`
    UPDATE
        character_comments
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
    DELETE FROM character_comments 
    WHERE comment_id = $1 AND user_id = $2`,
			[comment_id, user_id],
		)
	},
}

export default CharacterComments
