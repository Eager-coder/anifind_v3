import { customAlphabet, urlAlphabet } from "nanoid"
import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"
interface Thread {
	username: string
	avatar_url: string
	user_id: string
	thread_id: string
	topic: string
	body: string
	is_edited: boolean
	created_at: number
	is_deleted: boolean
	like_count: number
	is_liked?: boolean
}
const Threads = {
	async getAll(): Promise<Thread[]> {
		const { rows } = await pool.query(`
      SELECT 
        username, avatar_url, threads.user_id, thread_id, 
        topic, body, is_edited, threads.created_at 
      FROM 
        threads
      LEFT JOIN users
      ON users.id = threads.user_id
      WHERE 
        threads.is_deleted = FALSE
      ORDER BY created_at DESC 
    `)
		return rows
	},
	async getOneWithAuth(thread_id: string, user_id: string): Promise<Thread> {
		const { rows } = await pool.query(
			`
    SELECT
      EXISTS (SELECT 1 FROM thread_likes WHERE
        thread_likes.user_id = $2
        AND thread_likes.thread_id = $1
      ) AS is_liked,
      username,
      avatar_url,
      threads.user_id,
      threads.thread_id,
      topic,
      body,
      is_edited,
      threads.created_at,
      is_deleted,
      COUNT(thread_likes) AS like_count
    FROM
      threads
      LEFT JOIN users ON users.id = threads.user_id
      LEFT JOIN thread_likes ON thread_likes.thread_id = threads.thread_id
    WHERE
      threads.thread_id = $1
    GROUP BY
      threads.thread_id,
      users.id
    `,
			[thread_id, user_id]
		)
		return rows[0]
	},
	async getUserThreads(user_id: string) {
		const { rows } = await pool.query(
			`
		SELECT * FROM threads WHERE user_id = $1`,
			[user_id]
		)
		return rows
	},
	async getOneWithoutAuth(thread_id: string): Promise<Thread> {
		const { rows } = await pool.query(
			`
    SELECT
      threads.thread_id ,
      topic,
      body,
      is_edited,
      threads.created_at,
      threads.user_id,
      username,
      avatar_url,
      is_deleted,
      COUNT(thread_likes) AS like_count
    FROM
      threads
      LEFT JOIN users ON users.id = threads.user_id
      LEFT JOIN thread_likes ON thread_likes.thread_id = threads.thread_id
    WHERE
      threads.thread_id = $1
    GROUP BY
      threads.thread_id,
      users.id`,
			[thread_id]
		)
		return rows[0]
	},
	async getOne(thread_id: string): Promise<Thread> {
		const { rows } = await pool.query(
			`
    SELECT * FROM threads WHERE thread_id = $1`,
			[thread_id]
		)
		return rows[0]
	},
	async getOneWithUserId(thread_id: string, user_id: string): Promise<Thread> {
		const { rows } = await pool.query(
			`
    SELECT * FROM threads 
    WHERE thread_id = $1 AND user_id = $2
    LIMIT 1`,
			[thread_id, user_id]
		)
		return rows[0]
	},
	async create(user_id: string, topic: string, body: string) {
		const thread_id = customAlphabet(urlAlphabet, 12)()
		await pool.query(
			`
    INSERT INTO threads 
      (thread_id, user_id, topic, body, created_at)
    VALUES 
      ($1, $2, $3, $4, $5)`,
			[thread_id, user_id, topic, body, getUnixTimeNow()]
		)
		return thread_id
	},
	async edit(thread_id: string, user_id: string, topic: string, body: string) {
		await pool.query(
			`
    UPDATE threads SET topic = $1, body = $2, is_edited = TRUE 
    WHERE thread_id = $3 AND user_id = $4`,
			[topic, body, thread_id, user_id]
		)
	},
	async softDelete(thread_id: string, user_id: string) {
		await pool.query(
			`
    UPDATE threads SET is_deleted = TRUE 
    WHERE thread_id = $1 AND user_id = $2`,
			[thread_id, user_id]
		)
	},
	async hardDelete(thread_id: string, user_id: string) {
		await pool.query(
			`
    DELETE FROM threads 
    WHERE thread_id = $1 AND user_id = $2`,
			[thread_id, user_id]
		)
	},
	async like(thread_id: string, user_id: string) {
		await pool.query(
			`
      INSERT INTO 
        thread_likes
        (thread_id, user_id, liked_at)
      VALUES
        ($1, $2, $3)
      ON CONFLICT (thread_id, user_id) 
      DO UPDATE SET liked_at = $3
    `,
			[thread_id, user_id, getUnixTimeNow()]
		)
	},
	async unlike(thread_id: string, user_id: string) {
		await pool.query(
			`
      DELETE FROM thread_likes 
      WHERE thread_id = $1 AND user_id = $2`,
			[thread_id, user_id]
		)
	},
}
export default Threads
