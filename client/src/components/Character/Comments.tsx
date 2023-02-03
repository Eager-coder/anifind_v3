import { FC, FormEvent, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { PrimaryBtn } from "../styles/ButtonStyles"
import LoadingSpinner from "../general/LoadingSpinner"
import Comment, { CommentType } from "./Comment"
import { AppContext } from "../../context/AppContext"
import { H2 } from "../styles/Styles"

type Props = {
	character_id: number
}

const Comments: FC<Props> = ({ character_id }) => {
	const [comments, setComments] = useState<CommentType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSending, setIsSending] = useState(false)
	const { client } = useContext(AppContext)
	const getComments = async () => {
		setIsLoading(true)
		const { data } = await client(`/characters/comments/${character_id}`)
		setComments(data)
		setIsLoading(false)
	}
	useEffect(() => {
		let isMounted = true
		client(`/characters/comments/${character_id}`).then(({ data }) => {
			if (isMounted) {
				setComments(data)
				setIsLoading(false)
			}
		})
		return () => {
			isMounted = false
		}
	}, [])

	const [text, setText] = useState("")

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSending(true)
		const { ok } = await client(`/characters/comments/${character_id}`, {
			method: "POST",
			body: { text },
			shouldShowMessage: "default",
		})
		if (ok) {
			await getComments()
			setText("")
		}
		setIsSending(false)
	}

	return (
		<Container>
			<H2>Comments</H2>
			<CommentForm onSubmit={handleSubmit}>
				<textarea
					name="comment"
					onChange={e => setText(e.target.value)}
					disabled={isSending}
					value={text}
					placeholder="Add your comment"></textarea>
				<br />
				<PrimaryBtn disabled={isSending} customStyle="padding: 7px 10px; font-size: 1.2rem;">
					Send
				</PrimaryBtn>
			</CommentForm>
			<div className="all-comments">
				{isLoading ? <LoadingSpinner size={50} /> : null}
				{comments?.map(comment => (
					<Comment key={comment.comment_id} comment={comment} getComments={getComments} />
				))}
			</div>
		</Container>
	)
}
export default Comments

const Container = styled.section`
	width: 100%;
	margin: auto;

	.all-comments {
		margin-top: 20px;
	}
`
const CommentForm = styled.form`
	textarea {
		width: 100%;
		height: 100px;
		font-size: 1.2rem;
		border-radius: 4px;
		border: none;
		padding: 10px;
		margin-bottom: 10px;
	}
	@media (max-width: 768px) {
		textarea {
			font-size: 1rem;
		}
	}
`
