import { useState, useContext, useEffect, FC, useRef } from "react"
import { AppContext } from "../../context/AppContext"
import { UserContext } from "../../context/UserContext"
import cn from "classnames"
import { PrimaryBtn } from "../styles/ButtonStyles"
import { Socket } from "socket.io-client"
import format from "date-fns/format"
import useStateRef from "react-usestateref"

interface Props {
	socket: Socket
}

interface Message {
	id: number
	message: string
	sender_id: string
	recipient_id: string
	chat_id: string
	created_at: number
}

interface Chat {
	recipient_id: string
	recipient_username: string
	recipient_avatar: string
	id: string
	messages: Message[]
	is_new?: boolean
}

const Messages: FC<Props> = ({ socket: io }: { socket: Socket }) => {
	const { user } = useContext(UserContext)
	const [chats, setChats, chatsRef] = useStateRef<Chat[]>([])
	const { client } = useContext(AppContext)
	const [currentChat, setCurrentChat, currentChatRef] = useStateRef<Chat | null>(null)
	const [sidebar, setSidebar] = useState<"chats" | "users">("chats")
	const [users, setUsers] = useState<any>([])
	const [message, setMessage] = useState("")
	const socket = useRef(io)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const messageViewRef = useRef<HTMLDivElement | null>(null)

	const getChats = async () => {
		const { data } = await client("/messages")
		setChats(data)
	}

	useEffect(() => {
		getChats()
		if (socket.current.disconnected) {
			socket.current.connect()
		}
		socket.current.on("auth:unauthorized", async () => {
			await client("/refresh-token", { method: "POST" })
		})

		socket.current.on("message:receive", async (data: Message) => {
			if (!chatsRef.current.find(chat => chat.id == data.chat_id) && data.recipient_id == user.id) {
				const { data: newChat } = await client(`/messages/${data.sender_id}`)

				setChats(prev => [...prev, { ...newChat, messages: [data] }])
				return
			}

			setChats(prev =>
				prev.map(chat => {
					if (chat.id == data.chat_id) {
						return { ...chat, messages: [...chat.messages, data] }
					}
					return { ...chat }
				}),
			)
		})

		return () => {
			socket.current.off("connect")
			socket.current.off("disconnect")
			socket.current.off("pong")
		}
	}, [])

	useEffect(() => {
		currentChatRef?.current && showChat(currentChatRef.current.recipient_id)
	}, [chats])

	useEffect(() => {
		messageViewRef.current?.scroll({ top: messageViewRef.current.scrollHeight, behavior: "smooth" })
	})

	const showChat = (
		recipient_id: string,
		isNew?: boolean,
		user?: { username: string; id: string; avatar_url: string },
	) => {
		if (isNew && user) {
			let chat: Chat = {
				id: "",
				messages: [],
				recipient_avatar: user.avatar_url,
				recipient_id: user.id,
				recipient_username: user.username,
				is_new: true,
			}
			setCurrentChat(chat)
			setChats(prev => {
				if (prev?.length) {
					return [...prev, chat]
				} else {
					return [chat]
				}
			})
			setSidebar("chats")
		} else {
			setCurrentChat(chats?.find(chat => chat.recipient_id == recipient_id)!)
		}
	}

	async function showUsers() {
		if (!users.length) {
			let memberList: Array<{ username: string; id: string; avatar_url: string }> = (await client("/members")).data

			let userList = [...memberList]

			memberList.every(member => {
				if (chats.length) {
					chats?.every(chat => {
						userList = userList.filter(eachUser => {
							return eachUser.id !== chat.recipient_id && eachUser.id !== user.id
						})
					})
				} else {
					userList = userList.filter(eachUser => eachUser.id !== user.id)
				}
			})

			setUsers(userList)
		}
		setSidebar("users")
	}

	const sendMessage = async () => {
		if (!message.length) return
		if (currentChatRef.current?.is_new) {
			const { data: chat_id } = await client(`/messages`, {
				method: "POST",
				body: { recipient_id: currentChatRef.current.recipient_id },
			})

			setChats(prev => [
				...prev.filter(chat => chat.recipient_id != currentChatRef.current?.recipient_id),
				{ ...currentChatRef.current!, id: chat_id, is_new: false },
			])

			socket.current.emit("message:send", {
				message,
				recipient_id: currentChatRef.current!.recipient_id,
				chat_id,
			})
		} else {
			socket.current.emit("message:send", {
				message,
				recipient_id: currentChatRef.current!.recipient_id,
				chat_id: currentChatRef.current?.id,
			})
		}

		setMessage("")
	}

	return (
		<div className="w-[100%] min-h-[70vh] bg-white rounded-lg flex space-x-6">
			<div className="w-52 border-r border-gray-300 pl-4 pt-4 pb-4">
				{sidebar === "chats" ? (
					<div
						onClick={showUsers}
						className="w-max py-1 px-2 rounded-md flex items-center space-x-1 bg-[#e9f9f2] mb-4 cursor-pointer">
						<SearchIcon />
						<span className="text-gray-600">Search users</span>
					</div>
				) : (
					<div
						onClick={() => setSidebar("chats")}
						className="w-max py-1 px-2 rounded-md flex items-center space-x-1 bg-[#e9f9f2] mb-4 cursor-pointer">
						<ChatIcon />
						<span className="text-gray-600">Chats</span>
					</div>
				)}

				{sidebar === "chats" ? (
					<div className="">
						<h2>Chats</h2>
						{chats?.length ? (
							<div className="">
								{chats.map(chat => (
									<div
										onClick={() => showChat(chat.recipient_id)}
										className={cn("pb-2 mb-2 flex space-x-3 cursor-pointer border-b  border-gray-300", {
											"bg-[#e9f9f2]": chat.id == currentChat?.id,
										})}
										key={chat.recipient_username}>
										<img
											className="w-10 h-10 rounded-full"
											src={chat.recipient_avatar || "/assets/images/avatar.png"}
											alt=""
										/>
										<p className="break-all text-sm">{chat.recipient_username}</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-gray-600">Your chats will appear here</p>
						)}
					</div>
				) : (
					<div>
						<h2>Users</h2>
						<div className="h-[55vh] overflow-y-auto">
							{users.map((user: any) => (
								<div
									onClick={() => showChat("", true, user)}
									className="pb-2 mb-2 flex space-x-3 cursor-pointer border-b  border-gray-300"
									key={user.username}>
									<img className="w-10 h-10 rounded-full" src={user.avatar_url || "/assets/images/avatar.png"} alt="" />
									<p className="break-all text-sm">{user.username}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			<div className="flex-1 w-[100%] p-4 flex flex-col justify-between">
				{currentChat ? (
					<>
						<div className="h-[65vh] overflow-y-auto" ref={messageViewRef}>
							{currentChat.messages?.map(message => (
								<div
									key={message.id}
									className={cn("border py-1 px-2 rounded-lg w-max mb-2 flex flex-col items-end", {
										"ml-auto items-start": message.sender_id == user.id,
									})}>
									<p className="break-words max-w-sm">{message.message}</p>
									<span className="text-gray-400 text-[12px]"> {format(message.created_at * 1000, "p MM/dd/yy")}</span>
								</div>
							))}
						</div>
						<div className="flex justify-between space-x-6">
							<input
								ref={inputRef}
								className="border p-2 rounded-md flex-1"
								type="text"
								placeholder="Type here..."
								onKeyDown={e => e.key === "Enter" && sendMessage()}
								value={message}
								onChange={e => setMessage(e.target.value)}
							/>
							<PrimaryBtn
								onClick={() => {
									sendMessage()
									inputRef?.current?.focus()
								}}>
								Send
							</PrimaryBtn>
						</div>
					</>
				) : (
					<div className="w-full h-full flex justify-center items-center">
						<p>
							Select a chat or create <span>a new</span>
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Messages

const SearchIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="currentColor"
		className="w-5 h-5">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
		/>
	</svg>
)

const ChatIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
		/>
	</svg>
)
