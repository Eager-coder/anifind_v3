import { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { UserContext } from "../../context/UserContext"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import UserLink from "../UserLink"
export type CommentType = {
	user_id: string
	comment_id: number
	username: string
	avatar_url: string
	created_at: number
	is_edited: boolean
	text: string
}
type CommentProps = {
	comment: CommentType
	getComments: () => Promise<void>
}
const Comment: FC<CommentProps> = ({ comment, getComments }) => {
	const [newComment, setNewComment] = useState(comment.text)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [pending, setPending] = useState(false)
	const { id } = useContext(UserContext).user
	const { showModal, client } = useContext(AppContext)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (isEditOpen && !pending) {
			setIsEditOpen(false)
		}
	}, [comment])

	const handleEditSubmit = async () => {
		setPending(true)
		const { ok } = await client(`/characters/comments/${comment.comment_id}`, {
			method: "PUT",
			body: { text: newComment },
			shouldShowMessage: "default",
		})
		if (ok) {
			await getComments()
		}

		setIsEditOpen(false)
		setPending(false)
	}
	useLayoutEffect(() => {
		if (textareaRef.current != null) {
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = scrollHeight + "px"
			if (isEditOpen) {
				textareaRef.current.selectionStart = textareaRef.current.value.length
				textareaRef.current.selectionEnd = textareaRef.current.value.length
				textareaRef.current.focus()
			}
		}
	}, [textareaRef.current, isEditOpen])
	return (
		<CommentBox>
			<div className="top-bar">
				<UserLink
					username={comment.username}
					avatar_url={comment.avatar_url}
					date={comment.created_at}
					isEdited={comment.is_edited}
				/>
				{id === comment.user_id && (
					<div className="actions">
						{isEditOpen ? (
							<>
								<SecondaryBtn size="small" onClick={() => setIsEditOpen(false)} disabled={pending}>
									Cancel
								</SecondaryBtn>
								<PrimaryBtn
									size="small"
									customStyle="margin-left:15px;"
									onClick={handleEditSubmit}
									disabled={pending}>
									Submit
								</PrimaryBtn>
							</>
						) : (
							<>
								<SecondaryBtn size="small" onClick={() => setIsEditOpen(true)} disabled={pending}>
									Edit
								</SecondaryBtn>
								<PrimaryBtn
									color="red"
									size="small"
									customStyle="margin-left: 15px;"
									onClick={() =>
										showModal("DELETE_COMMENT", { getComments, comment, type: "characters" })
									}
									disabled={pending}>
									Delete
								</PrimaryBtn>
							</>
						)}
					</div>
				)}
			</div>
			{isEditOpen ? (
				<textarea
					ref={textareaRef}
					name="newComment"
					defaultValue={newComment}
					onChange={e => setNewComment(e.target.value)}></textarea>
			) : (
				<p className="comment">{comment.text}</p>
			)}
		</CommentBox>
	)
}
export default Comment
const CommentBox = styled.div`
	border-radius: 4px;
	padding: 15px;
	margin: 10px 0;
	background: ${({ theme }) => theme.commentBg};
	.top-bar {
		display: flex;
		justify-content: space-between;
	}
	.comment-data {
		width: 100%;
		display: flex;
		align-items: center;
		.user-data {
			display: flex;
			align-items: center;
		}
		img {
			width: 30px;
			height: 30px;
			object-fit: cover;
			margin-right: 10px;
			border-radius: 4px;
		}
		.username {
			color: #70c7a7;
		}
		.date {
			font-size: 0.85rem;
			margin-left: 20px;
			color: grey;
		}
	}
	.actions {
		display: flex;
		align-items: center;
	}
	p {
		margin-top: 15px;
		white-space: pre-line;
	}
	textarea {
		margin: 5px 0;
		padding: 5px;
		width: 100%;
		font-size: 1rem;
		height: unset;
		border-radius: 4px;
		border: none;
	}
	@media (max-width: 768px) {
		p,
		textarea {
			font-size: 0.9rem;
		}
	}
`
/*
const CommentBox = styled.div`
	border-radius: 4px;
	padding: 15px;
	margin: 10px 0;
	background: ${({ theme }) => theme.commentBg};
	.top-bar {
		display: flex;
		justify-content: space-between;
	}
	.comment-data {
		width: 100%;
		display: flex;
		align-items: center;
		.user-data {
			display: flex;
			align-items: center;
		}
		img {
			width: 30px;
			height: 30px;
			object-fit: cover;
			margin-right: 10px;
			border-radius: 4px;
		}
		.username {
			color: #70c7a7;
		}
		.date {
			font-size: 0.85rem;
			margin-left: 20px;
			color: grey;
		}
	}
	.actions {
		display: flex;
		align-items: center;
	}
	p {
		margin-top: 15px;
	}
	textarea {
		margin: 5px 0;
		padding: 5px;
		width: 100%;
		font-size: 1rem;
		height: auto;
		border-radius: 4px;
		border: none;
	}
`
*/
