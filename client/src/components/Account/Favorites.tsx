import { useState, useEffect, FC, useContext } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import LoadingSpinner from "../general/LoadingSpinner"
import { H1, H2 } from "../styles/Styles"
interface Anime {
	anime_id?: number
	title?: string
	cover_image: string
}
interface Character {
	character_id?: number
	name?: string
	cover_image: string
}
interface Favorites {
	anime: Anime[]
	characters: Character[]
}
const Favorites: FC = () => {
	const [favorites, setFavorites] = useState<Favorites | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const { client } = useContext(AppContext)
	useEffect(() => {
		let isMounted = true
		setIsLoading(true)
		;(async () => {
			const { data: animeData } = await client("/anime/favorites")
			const { data: characterData } = await client("/characters/favorites")
			if (isMounted) {
				setFavorites({ anime: animeData, characters: characterData })
				setIsLoading(false)
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])
	if (isLoading) return <LoadingSpinner />
	return (
		<Container>
			<H1>Favorites</H1>
			<H2>Anime</H2>
			{favorites?.anime?.length ? (
				<div className="list">
					{favorites?.anime.map(anime => (
						// <AnimeCard key={anime.anime_id} anime={anime} />
						<Card key={anime.anime_id} item={anime} />
					))}
				</div>
			) : (
				<p>
					You have no favorites. Why not to browse <Link to="/">anime</Link>?
				</p>
			)}
			<H2>Chacarters</H2>
			{favorites?.characters?.length ? (
				<div className="list">
					{favorites?.characters.map(character => (
						// <AnimeCard key={anime.anime_id} anime={anime} />
						<Card key={character.character_id} item={character} />
					))}
				</div>
			) : (
				<p>
					You have no favorites. Why not to browse <Link to="/">characters</Link>?
				</p>
			)}
		</Container>
	)
}
export default Favorites
interface Card {
	item: Anime & Character
}
const Card: FC<Card> = ({ item }) => {
	const link = item.anime_id ? `/anime/${item.anime_id}` : `/character/${item.character_id}`
	const title = item.title || item.name
	return (
		<CardContainer>
			<Link to={link}>
				<img src={item.cover_image} alt="" />
				<p>{title}</p>
			</Link>
		</CardContainer>
	)
}
//
const Container = styled.section`
	width: 100%;
	.list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 120px);
		column-gap: 20px;
		row-gap: 20px;
		@media (max-width: 640px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media (max-width: 400px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	button {
		cursor: pointer;
		width: max-content;
		border: none;
		border-radius: 4px;
		background-color: rgb(199, 77, 77);
		color: white;
		margin-top: 5px;
		padding: 3px 5px;
		&:disabled {
			background-color: grey;
		}
	}
`

const CardContainer = styled.div`
	width: 120px;
	display: flex;
	flex-direction: column;
	img {
		width: 100%;
		aspect-ratio: 2 / 3;
		object-fit: cover;
		border-radius: 5px;
	}
	p {
		font-size: 0.9rem;
		height: 30px;
		margin-bottom: 5px;
	}
	@media (max-width: 640px) {
		/* grid-template-columns: repeat(3, 1fr); */
		width: 100%;
	}
`
