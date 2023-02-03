import { useContext, useEffect, useState, FC } from "react"
import { Socket } from "socket.io-client"
import styled from "styled-components"
import { AppContext } from "../context/AppContext"
import { UserContext } from "../context/UserContext"
import cn from "classnames"
import { PrimaryBtn } from "../components/styles/ButtonStyles"

interface Props {
	socket: Socket
}

interface Message {
	message: string
	sender_id: string
	recipient_id: string
	chat_id: string
}

interface User {
	id: string
	avatar_url: string
	username: string
}

interface CurrentChat {
	recipient_id: string
	recipient_username: string
	recipient_avatar: string
	chat_id: string
	messages: Message[]
}

const MessagesPage: FC<Props> = ({ socket }) => {
	const { user, setUser } = useContext(UserContext)
	const { client } = useContext(AppContext)

	const [users, setUsers] = useState([])
	const [currentChat, setCurrentChat] = useState<CurrentChat | null>(null)
	const [allChats, setAllChats] = useState<CurrentChat[]>([])

	socket.on("message:receive", (message: Message) => {
		const chat = allChats.find(chat => chat.recipient_id == message.recipient_id)
		if (chat) {
			chat.messages.push(message)
			const newChatList = allChats.map(each => {
				if (each.chat_id == chat.chat_id) {
					each.messages.push(message)
				}

				return each
			})
			setAllChats(newChatList)
		}
	})

	useEffect(() => {
		if (currentChat) {
			setCurrentChat(allChats.find(chat => chat.chat_id == currentChat.chat_id)!)
		}
	}, [allChats])

	useEffect(() => {
		return () => {
			socket.disconnect()
		}
	}, [])

	useEffect(() => {
		if (!user.isLoading && user.isLoggedIn) {
			if (socket.disconnected) {
				socket.connect()
			}
			;(async () => {
				if (!users.length) {
					const { data } = await client("/members")
					setUsers(data)
				}
			})()
		}
	}, [user])

	const [message, setMessage] = useState("")
	const sendMessage = async () => {
		if (message.length) {
			socket.emit("message:send", { message, recipient_id: "cbba9584-d90f-40cb-9bb5-196f60fe9a38" })
		}
	}

	const showChat = async (recipient: User) => {
		const chat = allChats?.find(chat => chat.recipient_id == recipient.id)
		if (chat) {
			setCurrentChat(chat)
		} else {
			const messages: Message[] = (await client(`/messages?recipient_id=${recipient.id}`)).data!
			const newChat = {
				recipient_id: recipient.id,
				recipient_avatar: recipient.avatar_url,
				recipient_username: recipient.username,
				chat_id: messages[0].chat_id,
				messages,
			}
			setAllChats(prevChats => [...prevChats, newChat])
			setCurrentChat(newChat)
		}
	}

	return (
		<div className="flex space-x-6 max-w-6xl mx-auto px-14">
			<div className="w-40">
				<h1 className="text-2xl mb-6">Chats</h1>
				<div className="h-[500px] overflow-y-scroll"></div>
			</div>
			<div className="flex-grow">
				<h1>Messages</h1>
				<div className="h-[70vh] overflow-y-scroll ">
					{currentChat?.messages &&
						currentChat.messages.map((message: any) => (
							<div
								key={message.id}
								className={cn("border-2 p-1 rounded-md w-max", {
									"ml-auto": message.sender_id == user.id,
								})}>
								{message.message}
							</div>
						))}
				</div>
				<div className="flex justify-between space-x-6">
					<input
						className="border p-2 rounded-md flex-1"
						type="text"
						placeholder="Type here..."
						value={message}
						onChange={e => setMessage(e.target.value)}
					/>
					<PrimaryBtn onClick={sendMessage}>Send</PrimaryBtn>
				</div>
			</div>
		</div>
	)
}

export default MessagesPage

/*
{users
						? users.map((user: User) => (
								<div onClick={() => showChat(user)} className="w-max mb-3 bg-gray-400 cursor-pointer" key={user.id}>
									<img className="w-10 h-10" src={user.avatar_url} alt="" />
									<div>{user.username}</div>
								</div>
						  ))
						: null}
						 */
