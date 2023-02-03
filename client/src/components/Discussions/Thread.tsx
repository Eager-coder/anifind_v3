import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import UserLink from "../UserLink"
import Like from "../Like"
import { UserContext } from "../../context/UserContext"
import { RouteComponentProps } from "react-router"
import { AppContext } from "../../context/AppContext"
import LoadingSpinner from "../general/LoadingSpinner"

export type ThreadType = {
	thread_id: string
	topic?: string
	body?: string
	avatar_url?: string
	like_count?: number
	created_at?: number
	user_id?: string
	username?: string
	is_deleted?: boolean
	is_liked?: boolean
	isEdited?: boolean
}

type Props = {
	thread: ThreadType
	setThread: Dispatch<SetStateAction<ThreadType>>
	history: RouteComponentProps["history"]
}

const Thread: FC<Props> = ({ thread, setThread, history }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [isEditLoading, setIsEditLoading] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isLikePending, setIsLikePending] = useState(true)
	const [editedThread, setEditedThread] = useState({
		topic: "",
		body: "",
	})
	const user = useContext(UserContext).user
	const { showModal, client } = useContext(AppContext)
	useEffect(() => {
		if (!user.isLoading && !thread.topic) {
			getThread()
		}
	}, [user.isLoading])

	const getThread = async () => {
		const { data } = await client(`/discussions/threads/${thread.thread_id}`)
		if (!data) return history.replace("/404")
		setIsLoading(false)
		setIsLikePending(false)
		setIsEditOpen(false)
		setThread(data)
		setEditedThread({ topic: data.topic, body: data.body })
	}
	const handleEdit = async () => {
		setIsEditLoading(true)
		const { ok } = await client(`/discussions/threads/${thread.thread_id}`, {
			method: "PUT",
			body: editedThread,
			shouldShowMessage: "default",
		})
		if (ok) {
			getThread()
			setIsEditOpen(false)
		}
		setIsEditLoading(false)
	}
	const handleDelete = () => {
		showModal("DELETE_THREAD", { thread, getThread, history })
	}

	const handleLike = async () => {
		setIsLikePending(true)
		const { ok } = await client(`/discussions/threads/like/${thread.thread_id}`, {
			method: "POST",
			shouldShowMessage: "error",
		})
		if (ok) {
			setThread(prev => ({ ...prev, is_liked: true, like_count: Number(prev.like_count) + 1 }))
			setIsLikePending(false)
		}
	}

	const handleUnlike = async () => {
		setIsLikePending(true)
		const { ok } = await client(`/discussions/threads/like/${thread.thread_id}`, {
			method: "DELETE",
			shouldShowMessage: "error",
		})
		if (ok) {
			setThread(prev => ({ ...prev, is_liked: false, like_count: Number(prev.like_count) - 1 }))
			setIsLikePending(false)
		}
	}
	if (isLoading) return <LoadingSpinner />
	if (isEditOpen)
		return (
			<ThreadCardEl>
				<input
					type="text"
					id="edit-topic"
					value={editedThread.topic}
					onChange={e => setEditedThread(prev => ({ ...prev, topic: e.target.value }))}
					disabled={isEditLoading}
				/>
				<textarea
					id="edit-body"
					value={editedThread.body}
					onChange={e => setEditedThread(prev => ({ ...prev, body: e.target.value }))}
					disabled={isEditLoading}></textarea>
				<div className="buttons">
					<div className="left">
						<SecondaryBtn onClick={() => setIsEditOpen(false)}>Cancel</SecondaryBtn>
						<PrimaryBtn onClick={handleEdit} disabled={isEditLoading}>
							Submit
						</PrimaryBtn>
					</div>

					<SecondaryBtn color="red" onClick={handleDelete}>
						Delete
					</SecondaryBtn>
				</div>
			</ThreadCardEl>
		)
	return (
		<ThreadCardEl>
			<h1>{thread.topic}</h1>
			<p className="body">{thread.body}</p>

			<div className="actions">
				<UserLink
					avatar_url={thread.avatar_url!}
					username={thread.username!}
					date={thread.created_at!}
					isEdited={thread.isEdited!}
				/>
				<div className="like-edit">
					<Like
						count={thread.like_count!}
						isLiked={thread.is_liked!}
						isPending={isLikePending}
						onClick={thread.is_liked ? handleUnlike : handleLike}
					/>
					{thread.user_id === user.id && !thread.is_deleted ? (
						<SecondaryBtn onClick={() => setIsEditOpen(true)}>Edit</SecondaryBtn>
					) : null}
				</div>
			</div>
		</ThreadCardEl>
	)
}
export default Thread
const ThreadCardEl = styled.div`
	margin-bottom: 50px;
	@media (max-width: 640px) {
		margin-bottom: 30px;
	}
	h1 {
		font-size: 2.2rem;
		@media (max-width: 768px) {
			font-size: 1.7rem;
		}
		@media (max-width: 640px) {
			font-size: 1.4rem;
		}
	}
	p.body {
		white-space: pre-line;
		font-size: 1.1rem;
		margin: 10px 0;
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
	.actions {
		display: flex;
		.like-edit {
			display: flex;
			> * {
				margin-right: 15px;
			}
		}
	}
	// edit
	input#edit-topic {
		font-size: 1.1rem;
		margin-bottom: 15px;
		padding: 5px 8px;
		width: 100%;
		border: none;
		border-radius: 4px;
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
	textarea {
		width: 100%;
		height: 100px;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		padding: 10px;
		margin-bottom: 10px;
		@media (max-width: 640px) {
			font-size: 0.85rem;
		}
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			display: flex;
			align-items: center;
			> button {
				margin-right: 15px;
			}
		}
	}
`
