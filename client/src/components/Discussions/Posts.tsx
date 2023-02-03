import { FC, memo, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { PrimaryBtn } from "../styles/ButtonStyles"
import LoadingSpinner from "../general/LoadingSpinner"
import RenderPosts from "./RenderPosts"
import { ThreadType } from "./Thread"
export interface Post {
	post_id: string
	created_at: number
	body: string
	parent_id: string
	username: string
	user_id: string
	is_edited: boolean
	is_deleted: boolean
	is_liked: boolean
	like_count: number
	avatar_url: string
	children: Post[]
}
const Posts: FC<{ thread: ThreadType }> = ({ thread }) => {
	const [newPost, setNewPost] = useState({ text: "", isLoading: false })
	const [posts, setPosts] = useState<Post[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { client } = useContext(AppContext)
	useEffect(() => {
		getPosts().then(() => setIsLoading(false))
	}, [])
	const getPosts = async () => {
		const { data } = await client(`/discussions/threads/${thread.thread_id}/posts`)
		setPosts(data)
	}

	const submitPost = async (parent_id: string | null, body: string) => {
		setNewPost({ ...newPost, isLoading: true })
		const { ok } = await client(`/discussions/threads/${thread.thread_id}/posts`, {
			method: "POST",
			body: {
				parent_id,
				body,
			},
			shouldShowMessage: "default",
		})
		if (ok) {
			getPosts()
		}
		setNewPost({ text: "", isLoading: false })
	}

	if (isLoading) return <LoadingSpinner />
	return (
		<>
			{thread.is_deleted ? null : (
				<CommentForm>
					<textarea
						name="comment"
						onChange={e => setNewPost({ text: e.target.value, isLoading: false })}
						value={newPost.text}
						placeholder="Add your post"></textarea>
					<br />
					<PrimaryBtn
						onClick={() => submitPost(null, newPost.text)}
						disabled={newPost.isLoading}
						customStyle={`font-size: 1.2rem; padding: 5px 10px;`}>
						Send
					</PrimaryBtn>
				</CommentForm>
			)}
			{posts ? (
				posts.map(post => (
					<RenderPosts
						post={post}
						thread={{ thread_id: thread.thread_id, is_deleted: thread.is_deleted! }}
						getPosts={getPosts}
						key={post.post_id}
					/>
				))
			) : (
				<div>Nothing to display</div>
			)}
		</>
	)
}
export default memo(Posts)
// Duplicate from Comments.jsx
const CommentForm = styled.div`
	margin-bottom: 30px;

	textarea {
		width: 100%;
		height: 100px;
		font-size: 1.2rem;
		border-radius: 4px;
		border: none;
		padding: 10px;
		margin-bottom: 10px;
		@media (max-width: 768px) {
			font-size: 1rem;
		}
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
`
