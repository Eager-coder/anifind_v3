import pool from "../config/db"
import { getUnixTimeNow } from "../utils/getTime"

interface Message {
	id: number
	message: string
	sender_id: string
	recipient_id: string
	conversation_id: string
	created_at: number
}

const Chats = {
	async createChat(sender_id: string, recipient_id: string) {
		const { rows } = await pool.query(
			`
			WITH e AS (
				INSERT INTO chats (user1_id, user2_id, created_at) VALUES ($1, $2, $3) ON CONFLICT (user1_id, user2_id) DO NOTHING RETURNING chats.id
				
			) SELECT * FROM e
			UNION SELECT id FROM chats WHERE user1_id = $1 AND user2_id = $2
			`,
			[sender_id, recipient_id, getUnixTimeNow()],
		)
		return rows[0].id
	},

	async getMessages(user_id: string) {
		const { rows: chats } = await pool.query(
			`
		SELECT chats.id as id, username as recipient_username, user2_id as recipient_id, avatar_url as recipient_avatar FROM chats
			LEFT JOIN users
			ON chats.user2_id = users.id
			WHERE chats.user1_id = $1
		UNION 
		SELECT chats.id as id, username, user1_id as recipient_id, avatar_url as recipient_avatar FROM chats
			LEFT JOIN users
			ON chats.user1_id = users.id
			WHERE chats.user2_id = $1`,
			[user_id],
		)
		const { rows: messages } = await pool.query(
			"SELECT * FROM messages WHERE sender_id = $1 OR recipient_id = $1 ORDER BY created_at",
			[user_id],
		)

		messages.forEach(message => {
			chats.forEach(chat => {
				if (!chat?.messages) {
					chat.messages = []
				}
				if (chat.id == message.chat_id) {
					chat.messages.push(message)
				}
			})
		})
		return chats
	},

	async getChat(sender_id: string, recipient_id: string) {
		const chat = (
			await pool.query(
				`
			SELECT chats.id as id, username as recipient_username, user2_id as recipient_id, avatar_url as recipient_avatar FROM chats
			LEFT JOIN users
			ON chats.user2_id = users.id
			WHERE chats.user1_id = $1 AND chats.user2_id = $2
		UNION 
		SELECT chats.id as id, username, user1_id as recipient_id, avatar_url as recipient_avatar FROM chats
			LEFT JOIN users
			ON chats.user1_id = users.id
			WHERE chats.user2_id = $1 AND chats.user1_id = $2`,
				[sender_id, recipient_id],
			)
		).rows[0]

		return chat
	},

	async insertMessage(sender_id: string, recipient_id: string, chat_id: string, messageText: string) {
		const message = { chat_id, message: messageText, sender_id, recipient_id, created_at: getUnixTimeNow(), id: null }

		const { rows } = await pool.query(
			`INSERT INTO messages (chat_id, message, sender_id, recipient_id, created_at) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id
		`,
			[chat_id, messageText, sender_id, recipient_id, message.created_at],
		)
		message.id = rows[0].id
		return message
	},
}

export default Chats
