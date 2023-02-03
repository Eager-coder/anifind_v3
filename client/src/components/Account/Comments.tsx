import { useState, useEffect, FC, useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { formatRelative } from "date-fns"
import EmptyState from "../general/EmptyState"

import LoadingSpinner from "../general/LoadingSpinner"
import { AppContext } from "../../context/AppContext"
import { H1, H2 } from "../styles/Styles"
type AnimeComment = {
	comment_id: string
	text: string
	anime_id?: number
	created_at: number
	is_edited: boolean
}
type CharacterComment = {
	comment_id: string
	text: string
	character_id?: number
	created_at: number
	is_edited: boolean
}
const Comments: FC = () => {
	const [animeComments, setAnimeComments] = useState<AnimeComment[]>([])
	const [characterComments, setCharacterComments] = useState<CharacterComment[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { client } = useContext(AppContext)
	useEffect(() => {
		let isMounted = true

		const getComments = async () => {
			const { data: animeData } = await client("/anime/comments/user")
			const { data: characterData } = await client("/characters/comments/user")
			if (isMounted) {
				setAnimeComments(animeData)
				setCharacterComments(characterData)
				setIsLoading(false)
			}
		}
		getComments()
		return () => {
			isMounted = false
		}
	}, [])

	return (
		<CommentsContainer>
			<H1>All comments</H1>
			{isLoading ? (
				<LoadingSpinner size={50} padding={100} />
			) : (
				<>
					<H2>Anime comments</H2>
					{animeComments?.length ? (
						animeComments.map(comment => <Comment key={comment.comment_id} comment={comment} />)
					) : (
						<EmptyState src="/assets/images/empty_comments.png" header="You have no comments" />
					)}
					<H2>Character comments</H2>
					{characterComments?.length ? (
						characterComments.map(comment => <Comment key={comment.comment_id} comment={comment} />)
					) : (
						<EmptyState src="/assets/images/empty_comments.png" header="You have no comments" />
					)}
				</>
			)}
		</CommentsContainer>
	)
}
export default Comments

const Comment: FC<{ comment: AnimeComment & CharacterComment }> = ({ comment }) => {
	const link = comment.character_id ? `/character/${comment.character_id}` : `/anime/${comment.anime_id}`
	const linkTitle = comment.character_id ? "Character" : "Anime"
	return (
		<CommentBox>
			<p className="comment">{comment.text}</p>
			<div className="meta">
				<span>
					Commented on <Link to={link}>{linkTitle}</Link>
				</span>
				<span className="date">
					{formatRelative(new Date(comment.created_at * 1000), new Date())} {comment.is_edited && "(edited)"}
				</span>
			</div>
		</CommentBox>
	)
}

const CommentsContainer = styled.section`
	width: 100%;
`
const CommentBox = styled.div`
	border-radius: 4px;
	padding: 15px;
	margin: 10px 0;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.commentBg};

	p.comment {
		color: ${({ theme }) => theme.header};
		margin-bottom: 15px;
		font-size: 1rem;
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
	.meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
	}
	img {
		width: 20px;
		margin-left: 20px;
	}
`
