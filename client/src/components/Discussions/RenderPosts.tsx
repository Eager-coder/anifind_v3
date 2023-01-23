import { FC, memo, useContext, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { UserContext } from "../../context/UserContext"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import Like from "../Like"
import UserLink from "../UserLink"
import { Post } from "./Posts"
interface Props {
	post: Post
	depth?: number
	thread: {
		thread_id: string
		is_deleted: boolean
	}
	getPosts: () => Promise<void>
}
const RenderPosts: FC<Props> = ({ post, depth = 0, thread, getPosts }) => {
	const [isCommentFieldOpen, setIsCommentFieldOpen] = useState(false)
	const [newPost, setNewPost] = useState({ isLoading: false, text: "" })
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [editedPost, setEditedPost] = useState({ isLoading: false, text: post.body })
	const user = useContext(UserContext).user
	const { showModal, client } = useContext(AppContext)
	const [isLikePending, setIsLikePending] = useState(false)

	const handlePostSubmit = async () => {
		setNewPost(prev => ({ ...prev, isLoading: true }))
		const { ok } = await client(`/discussions/threads/${thread.thread_id}/posts`, {
			method: "POST",
			body: {
				parent_id: post.post_id,
				body: newPost.text,
			},
			shouldShowMessage: "default",
		})

		if (ok) {
			getPosts()
			setNewPost({ text: "", isLoading: false })
			setIsCommentFieldOpen(false)
		}
		setNewPost(prev => ({ ...prev, isLoading: false }))
	}

	const handleEditSubmit = async () => {
		setEditedPost(prev => ({ ...prev, isLoading: true }))
		const { ok } = await client(`/discussions/threads/${thread.thread_id}/posts/${post.post_id}`, {
			method: "PUT",
			body: {
				body: editedPost.text,
			},
			shouldShowMessage: "default",
		})
		if (ok) {
			await getPosts()
			setIsEditOpen(false)
		}
		setEditedPost({ text: post.body, isLoading: false })
	}
	const handleEditCancel = () => {
		setIsEditOpen(false)
		setEditedPost({ isLoading: false, text: post.body })
	}
	const handleLike = async () => {
		setIsLikePending(true)

		const { ok } = await client(
			`/discussions/threads/${thread.thread_id}/posts/${post.post_id}/like/`,
			{
				method: "POST",
				shouldShowMessage: "error",
			}
		)
		if (ok) {
			await getPosts()
		}
		setIsLikePending(false)
	}

	const handleUnlike = async () => {
		setIsLikePending(true)
		const { ok } = await client(
			`/discussions/threads/${thread.thread_id}/posts/${post.post_id}/like`,
			{
				method: "DELETE",
				shouldShowMessage: "error",
			}
		)
		if (ok) {
			await getPosts()
		}
		setIsLikePending(false)
	}
	return (
		<PostEl key={post.post_id} depth={depth}>
			{/* Top bar */}
			<div className="wrapper">
				<div className="top">
					<UserLink
						username={post.username}
						date={post.created_at}
						avatar_url={post.avatar_url}
						isEdited={post.is_edited}
					/>
					{!post.is_deleted && (
						<Like
							count={post.like_count}
							isLiked={post.is_liked}
							isPending={isLikePending}
							onClick={post.is_liked ? handleUnlike : handleLike}
						/>
					)}
					{isEditOpen && !post.is_deleted ? (
						<div className="edit-actions">
							<div className="left">
								<SecondaryBtn
									size="small"
									onClick={handleEditCancel}
									disabled={editedPost.isLoading}>
									Cancel
								</SecondaryBtn>
								<PrimaryBtn
									size="small"
									onClick={handleEditSubmit}
									disabled={editedPost.isLoading}
									customStyle={`padding: 2px 5px;`}>
									Submit
								</PrimaryBtn>
							</div>

							<PrimaryBtn
								size="small"
								color="red"
								onClick={() => showModal("DELETE_POST", { post, getPosts })}
								disabled={editedPost.isLoading}>
								Delete
							</PrimaryBtn>
						</div>
					) : (
						user.username === post.username &&
						!post.is_deleted &&
						!isCommentFieldOpen && (
							<SecondaryBtn onClick={() => setIsEditOpen(true)}>Edit</SecondaryBtn>
						)
					)}
				</div>
				{/* Edit */}
				{isEditOpen && !post.is_deleted ? (
					<textarea
						className="edit"
						value={editedPost.text}
						onChange={e => setEditedPost(prev => ({ ...prev, text: e.target.value }))}></textarea>
				) : (
					<p className="body">{post.body}</p>
				)}
				{/* Reply */}
				{isCommentFieldOpen ? (
					<>
						<textarea
							className="reply"
							onChange={e => setNewPost({ text: e.target.value, isLoading: false })}
							value={newPost.text}
							placeholder="Add your comment"></textarea>
						<div className="send-actions">
							<SecondaryBtn
								size="small"
								disabled={newPost.isLoading}
								onClick={() => setIsCommentFieldOpen(false)}>
								Cancel
							</SecondaryBtn>
							<PrimaryBtn
								size="small"
								disabled={newPost.isLoading}
								onClick={() => handlePostSubmit()}
								customStyle={`padding: 2px 5px;`}>
								Send
							</PrimaryBtn>
						</div>
					</>
				) : (
					!isEditOpen &&
					!thread.is_deleted &&
					!post.is_deleted && (
						<SecondaryBtn onClick={() => setIsCommentFieldOpen(true)}>Reply</SecondaryBtn>
					)
				)}
				{/* Replies */}
				{post?.children?.map(post => (
					<RenderPosts
						post={post}
						thread={thread}
						getPosts={getPosts}
						key={post.post_id}
						depth={Number(depth) + 1}
					/>
				))}
			</div>
		</PostEl>
	)
}
export default memo(RenderPosts)
const PostEl = styled.div<{ depth: number }>`
	margin: 15px 0;
	padding: ${({ depth }) => (depth === 0 ? "15px 15px 15px 0" : "0px")};
	border-left: 3px #b6b6b6 solid;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.commentBg};
	@media (max-width: 640px) {
		border-left: 2px #b6b6b6 solid;
	}
	.wrapper {
		padding-left: 20px;
		@media (max-width: 640px) {
			padding-left: 10px;
		}
	}
	.top {
		display: flex;
		align-items: center;
		> button {
			margin-left: 20px;
		}
	}
	p.body {
		margin: 15px 0;
		@media (max-width: 768px) {
			font-size: 0.9rem;
			margin: 10px 0;
			font-weight: 300;
		}
	}
	.edit-actions {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			button {
				margin: 0 10px;
			}
		}
	}
	.send-actions {
		display: flex;
		align-items: center;
		button {
			margin-right: 10px;
		}
	}
	textarea.reply,
	textarea.edit {
		width: 100%;
		height: 80px;
		font-size: 1rem;
		border-radius: 4px;
		padding: 5px;
		margin: 8px 0;
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
	textarea.reply {
		/* border: none; */
		border: 1px grey solid;
	}
	textarea.edit {
		border: 1px grey solid;
	}
`
