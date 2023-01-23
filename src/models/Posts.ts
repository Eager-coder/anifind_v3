import { customAlphabet, urlAlphabet } from "nanoid"
import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"
interface Post {
	post_id: string
	user_id: string
	parent_id: string
	body: string
	is_edited: boolean
	is_deleted: boolean
	created_at: number
	avatar_url: string
	username: string
	is_liked: boolean
	like_count: number
}
const Posts = {
	async getWithAuth(thread_id: string, user_id: string) {
		const { rows } = await pool.query(
			`
    SELECT 
      posts.post_id, posts.user_id, thread_id, parent_id, body, is_edited, 
      is_deleted, posts.created_at, users.avatar_url, users.username ,
      EXISTS (
        SELECT 1 FROM post_likes WHERE post_likes.user_id = $2 
        AND post_likes.post_id = posts.post_id) AS is_liked,
      COUNT(post_likes) AS like_count
    FROM 
      posts 
    LEFT JOIN users
      ON users.id = posts.user_id
    LEFT JOIN post_likes
      ON  posts.post_id = post_likes.post_id  
    WHERE 
      thread_id = $1
    GROUP BY posts.post_id, users.id`,
			[thread_id, user_id]
		)
		return rows
	},
	async getWithoutAuth(thread_id: string) {
		const { rows } = await pool.query(
			`
    SELECT 
      post_id, posts.user_id, parent_id, thread_id, body, is_edited, 
      is_deleted, posts.created_at, users.avatar_url, users.username 
    FROM 
      posts 
    LEFT JOIN users
      ON users.id = posts.user_id
    WHERE 
      thread_id = $1`,
			[thread_id]
		)
		return rows
	},
	async create(thread_id: string, user_id: string, parent_id: string | null, body: string) {
		await pool.query(
			`
    INSERT INTO posts 
      (post_id, thread_id, user_id, parent_id, body, created_at)
    VALUES 
      ($1, $2, $3, $4, $5, $6)
    `,
			[customAlphabet(urlAlphabet, 12)(), thread_id, user_id, parent_id, body, getUnixTimeNow()]
		)
	},
	async getUserPosts(post_id: string, user_id: string): Promise<Post> {
		const { rows } = await pool.query(
			`
    SELECT * FROM posts 
    WHERE post_id = $1 AND user_id = $2`,
			[post_id, user_id]
		)
		return rows[0]
	},
	async edit(post_id: string, body: string) {
		await pool.query(
			`
    UPDATE posts SET body = $1, is_edited = TRUE
    WHERE post_id = $2`,
			[body, post_id]
		)
	},
	async softDelete(post_id: string) {
		await pool.query(
			`
    UPDATE posts 
    SET body = '[deleted]', is_deleted = TRUE
    WHERE post_id = $1
    `,
			[post_id]
		)
	},
	async hardDelete(post_id: string) {
		await pool.query(`DELETE FROM posts WHERE post_id = $1`, [post_id])
	},
	async hasParent(post_id: string) {
		const { rows } = await pool.query(
			`
    SELECT 1 FROM posts 
    WHERE parent_id = $1 LIMIT 1`,
			[post_id]
		)
		return rows.length > 0
	},
	async getOneByThreadId(thread_id: string) {
		const { rows } = await pool.query(
			`
		SELECT * FROM posts 
		WHERE thread_id = $1 LIMIT 1
		`,
			[thread_id]
		)
		return rows[0]
	},
	async like(post_id: string, user_id: string) {
		await pool.query(
			`
		INSERT INTO 
			post_likes
			(post_id, user_id, liked_at)
		VALUES
			($1, $2, $3)
		ON CONFLICT (post_id, user_id) DO NOTHING	
		`,
			[post_id, user_id, getUnixTimeNow()]
		)
	},
	async unlike(post_id: string, user_id: string) {
		await pool.query(
			`
		DELETE FROM
			post_likes
		WHERE 
			post_id = $1 AND user_id = $2	
    `,
			[post_id, user_id]
		)
	},
}

export default Posts
