import { FC, memo, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import marked from "marked"
import characterQuery from "../api/anime/characterAPI"
import { Link } from "react-router-dom"
import { PrimaryBtn } from "../components/styles/ButtonStyles"
import LoadingSpinner from "../components/general/LoadingSpinner"
import { AppContext } from "../context/AppContext"
import Comments from "../components/Character/Comments"
import { H1, H2 } from "../components/styles/Styles"
import useWindowSize from "../utlis/useWindowSize"
marked.setOptions({ breaks: true })
interface Props {
	match: {
		params: {
			id: number
		}
	}
}
interface Character {
	character_id: number
	image: {
		large: string
		extraLarge: string
	}
	name: {
		full: string
	}
	description: string
	media: {
		edges: any
	}
}

const CharacterPage: FC<Props> = ({ match }) => {
	const character_id = match.params.id
	const [character, setCharacter] = useState<Character | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [favCharacter, setFavCharacter] = useState({ isFavorite: false, isLoading: true })
	const { client } = useContext(AppContext)
	const [isSmallScreen, setIsSmallScreen] = useState(false)
	const [width] = useWindowSize()
	useEffect(() => {
		let isMounted = true
		characterQuery(character_id).then(data => {
			if (isMounted) {
				setCharacter(data)
				setIsLoading(false)
			}
		})
		client(`/characters/favorites/is-favorite/${character_id}`).then(({ ok, data }) => {
			if (ok) {
				setFavCharacter({ isFavorite: data.is_favorite, isLoading: false })
			} else {
				setFavCharacter({ isFavorite: false, isLoading: false })
			}
		})

		return () => {
			isMounted = false
		}
	}, [])
	useEffect(() => {
		setIsSmallScreen(width < 768)
	}, [width])

	const handleAddToFavorites = async () => {
		setFavCharacter({ isFavorite: false, isLoading: true })
		const { ok } = await client(`/characters/favorites`, {
			method: "POST",
			body: {
				character_id,
				cover_image: character?.image.large,
				name: character?.name.full,
			},
			shouldShowMessage: "error",
		})
		setFavCharacter(prev => ({ isFavorite: ok ? true : prev.isFavorite, isLoading: false }))
	}

	const handleRemoveFromFavorites = async () => {
		setFavCharacter({ isFavorite: false, isLoading: true })
		const { ok } = await client(`/characters/favorites/${character_id}`, {
			method: "DELETE",
			shouldShowMessage: "error",
		})
		setFavCharacter(prev => ({ isFavorite: ok ? false : prev.isFavorite, isLoading: false }))
	}

	if (isLoading) return <LoadingSpinner />
	return (
		<CharacterPageEl>
			<section className="top">
				{isSmallScreen && <H1>{character?.name.full}</H1>}
				<div className="image">
					<img src={character?.image.extraLarge || character?.image.large} alt="" />
					<PrimaryBtn
						size="small"
						color={favCharacter.isFavorite ? "red" : "green"}
						onClick={() => (favCharacter.isFavorite ? handleRemoveFromFavorites() : handleAddToFavorites())}
						disabled={favCharacter.isLoading}
						isLoading={favCharacter.isLoading}>
						{favCharacter.isFavorite ? "Remove" : "Add to Favorites"}
					</PrimaryBtn>
				</div>
				<div className="text">
					{!isSmallScreen && <H1>{character?.name.full}</H1>}
					<div
						dangerouslySetInnerHTML={{
							__html: character?.description ? marked(character?.description!) : "",
						}}></div>
				</div>
			</section>
			<section className="relation">
				<H2>Appears in</H2>
				<RelationCardList>
					{character!.media.edges.map(({ node }: any) => (
						<RelationCard key={node.id}>
							<Link to={`/anime/${node.id}`}>
								<img src={node.coverImage.extraLarge || node.coverImage.large} alt="" />
								<br />
								<p>{node.title.english || node.title.romaji}</p>
							</Link>
						</RelationCard>
					))}
				</RelationCardList>
			</section>
			<section className="comments">
				<Comments character_id={character_id} />
			</section>
		</CharacterPageEl>
	)
}
export default memo(CharacterPage)
const CharacterPageEl = styled.div`
	max-width: 1200px;
	padding: 50px;
	margin: auto;
	@media (max-width: 768px) {
		padding: 20px;
	}
	section.top {
		display: flex;
		width: 100%;
		height: max-content;
		.text {
			width: 70%;
			p {
				font-size: 1.1rem;
			}
			del {
				background-color: ${({ theme }) => theme.text};
				:hover {
					background-color: unset;
					text-decoration: none;
				}
			}
		}
		.image {
			width: 30%;
			margin-right: 50px;
			img {
				width: 100%;
				height: auto;
				margin-bottom: 10px;
				border-radius: 5px;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
			}
		}
	}
	section.relation {
		margin: 30px 0;
	}
	@media (max-width: 768px) {
		section.top {
			flex-direction: column;
			h1 {
				text-align: center;
			}
			.text {
				width: 100%;
				margin-top: 20px;
				p {
					font-size: 0.9rem;
				}
			}
			.image {
				width: 100%;

				img {
					width: 200px;
					display: block;
					margin: 0 auto;
					margin-bottom: 20px;
				}
			}
		}
	}
`
const RelationCardList = styled.section`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: 20px;
	row-gap: 20px;
	@media (max-width: 720px) {
		grid-template-columns: repeat(4, 1fr);
	}
	@media (max-width: 640px) {
		grid-template-columns: repeat(3, 1fr);
	}
`
const RelationCard = styled.div`
	width: 100%;
	img {
		border-radius: 7px;
		aspect-ratio: 2 / 3;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
`
