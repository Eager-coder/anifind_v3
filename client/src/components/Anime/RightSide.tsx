import { FC } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { PrimaryBtn } from "../styles/ButtonStyles"
import { H1 } from "../styles/Styles"

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
const RightSide: FC<Props> = ({
	data,
	favAnime,
	handleAddToFavorites,
	handleRemoveFromFavorites,
	isLoading,
}) => {
	const btnName = favAnime.isFavorite ? "Remove" : "Add to Favorites"

	return (
		<Section>
			<H1 customStyle="margin-bottom: 10px;">{data.title.english || data.title.romaji}</H1>
			<div className="img-and-desc">
				<div className="mobile-img-cont">
					<img className="mobile-img" src={data.coverImage.extraLarge} alt="" />
					<PrimaryBtn
						disabled={favAnime.isLoading}
						isLoading={favAnime.isLoading || isLoading}
						onClick={() =>
							favAnime.isFavorite ? handleRemoveFromFavorites() : handleAddToFavorites()
						}
						className="fav-btn"
						size="small"
						color={favAnime.isFavorite ? "red" : "green"}>
						{btnName}
					</PrimaryBtn>
				</div>
				<p dangerouslySetInnerHTML={{ __html: data.description }}></p>
			</div>

			<ul className="genres">
				{data.genres.map((genre: string, index: string) => (
					<Link key={index} to={`/search?genre=${genre}`}>
						{genre}
					</Link>
				))}
			</ul>
			{data.trailer && (
				<iframe
					allowFullScreen
					className="trailer"
					title={data.title}
					width="100%"
					height="350px"
					src={`https://www.youtube.com/embed/${data.trailer.id}`}></iframe>
			)}
		</Section>
	)
}
export default RightSide

const Section = styled.section`
	width: 60%;
	margin-left: 50px;
	margin-top: 0px;

	.fav-btn {
		display: none;
	}
	p {
		font-size: 1.1rem;
		margin-bottom: 20px;
	}
	.mobile-img {
		display: none;
		border-radius: 7px;
	}
	.trailer {
		margin: 20px 0;
	}
	.genres {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20px;
		a {
			border: 1px rgba(0, 0, 0, 0.4) solid;
			color: #4c5264;
			background-color: white;
			border-radius: 7px;
			margin: 5px 0;
			margin-right: 10px;
			padding: 2px 5px;
		}
	}

	@media screen and (max-width: 768px) {
		width: 100%;
		margin: 0;
		.img-and-desc {
			display: flex;
			margin-bottom: 10px;
			p {
				font-size: 1rem;
				width: 70%;
			}
			.mobile-img-cont {
				width: 30%;
				height: auto;
				margin-right: 15px;

				.mobile-img {
					display: block;
					width: 100%;
					margin-bottom: 15px;
				}
			}
		}
		.fav-btn {
			display: block;
		}
		.genres {
			margin-top: 5px;
		}

		@media screen and (max-width: 480px) {
			margin-top: 20px;
			.img-and-desc {
				display: block;
				margin-bottom: 10px;
				p {
					font-size: 0.8rem;
					width: 100%;
					margin-bottom: 0;
					margin-top: 20px;
				}
				.mobile-img-cont {
					width: 100%;
					margin-right: 0px;
				}
			}
			iframe {
				height: 220px;
			}
			.genres {
				li {
					font-size: 0.9rem;
					margin: 5px 5px 5px 0;
					padding: 2px 5px;
				}
			}
		}
	}
`
