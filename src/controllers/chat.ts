import { Server, Socket } from "socket.io"
import cookie from "cookie"
import jwt from "jsonwebtoken"
import Chats from "../models/Chats"

export default function chat(io: Server) {
	io.on("connection", socket => {
		try {
			const cookies = cookie.parse(socket.handshake.headers.cookie!)
			const token = cookies.access_token
			if (!token) {
				socket.disconnect()
			}
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
			socket.data.user = decoded

			socket.on("message:send", async data => {
				const sender_id = socket.data.user.id
				let { message, recipient_id, chat_id } = data

				if (!recipient_id || !message) return

				const messageObj = await Chats.insertMessage(sender_id, recipient_id, chat_id, message)

				socket.emit("message:receive", messageObj)

				io.sockets.sockets.forEach(client => {
					if (client.data.user.id == recipient_id) {
						client.emit("message:receive", { ...messageObj })
					}
				})
			})
		} catch {
			socket.emit("auth:unauthorized")
			socket.disconnect()
		}
	})
}
