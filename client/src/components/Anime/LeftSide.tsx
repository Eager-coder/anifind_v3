import { FC } from "react"
import styled from "styled-components"
import { PrimaryBtn } from "../styles/ButtonStyles"
type Props = {
	data: any
	favAnime: {
		isFavorite: boolean
		isLoading: boolean
	}
	handleAddToFavorites: () => Promise<void>
	handleRemoveFromFavorites: () => Promise<void>
	isLoading: boolean
}
const LeftSide: FC<Props> = ({
	data,
	favAnime,
	handleAddToFavorites,
	handleRemoveFromFavorites,
	isLoading,
}) => {
	const btnName = favAnime.isFavorite ? "Remove" : "Add to Favorites"

	return (
		<Section>
			<img className="desktop-img" src={data.coverImage.extraLarge} alt="" />
			<PrimaryBtn
				disabled={favAnime.isLoading}
				isLoading={favAnime.isLoading || isLoading}
				onClick={() => (favAnime.isFavorite ? handleRemoveFromFavorites() : handleAddToFavorites())}
				className="fav-btn"
				size="small"
				color={favAnime.isFavorite ? "red" : "green"}>
				{btnName}
			</PrimaryBtn>
			<ul className="details">
				<li>
					Season
					<span>
						{data.season} {data.seasonYear}
					</span>
				</li>
				<li>
					Format <span>{data.format}</span>
				</li>
				<li>
					Episodes <span>{data.episodes}</span>
				</li>
				<li>
					Duration <span>{data.duration} min</span>
				</li>
				<li>
					Status <span>{data.status}</span>
				</li>
				<li>
					Studio <span>{data.studios?.edges[0]?.node?.name}</span>
				</li>
			</ul>
		</Section>
	)
}
export default LeftSide
const Section = styled.section`
	width: 35%;
	img {
		width: 100%;
		border-radius: 5px;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
		margin-bottom: 15px;
	}
	.details {
		margin: 20px 0;
		padding: 5px 20px;
		border-radius: 3px;
		background-color: white;
		box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
		li {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin: 10px 0;
			color: black;
			font-size: 1.1rem;
			span {
				color: #4c5264;
				font-size: 1rem;
			}
		}
	}
	@media screen and (max-width: 768px) {
		width: 100%;
		.details {
			margin: 0;
			padding: 10px 20px;
			border-radius: 0;
			box-shadow: none;
			li {
				margin: 5px 0;
				font-size: 1rem;
				span {
					font-size: 0.9rem;
				}
			}
		}
		.desktop-img {
			display: none;
		}
		.fav-btn {
			display: none;
		}
	}
	@media screen and (max-width: 480px) {
		.details {
			padding: 5px 10px;
			li {
				font-size: 0.9rem;
				span {
					font-size: 0.85rem;
				}
			}
		}
	}
`
// const GreenBtn = `
// 	width: max-content;
// 	height: max-content;
// 	padding: 5px;
// 	font-size: 0.8rem;
// 	@media screen and (max-width: 768px) {
// 		display: none !important;
// 	}
// `
// const RedBtn = `
// 	width: max-content;
// 	height: max-content;
// 	padding: 5px;
// 	font-size: 0.8rem;
// 	background-color: red;
// 	@media screen and (max-width: 768px) {
// 		display: none !important;
// 	}
// `
// const ButtonStyle = `
// 	width: max-content;
// 	height: max-content;
// 	padding: 5px;
// 	/* font-size: 1rem; */
// 	font-size: 0.8rem;
// 	@media screen and (max-width: 768px) {
// 		display: none;
// 	}
// `
