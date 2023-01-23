import styled from "styled-components"
import { FC, useState } from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { Link } from "react-router-dom"
export type CardType = {
	id: string
	title: {
		english: string
		romaji: string
	}
	coverImage: {
		large: string
		color: string
	}
}

export const Card: FC<{ item: CardType }> = ({ item }) => {
	const [loaded, setLoaded] = useState(false)
	const title = item.title.english ? item.title.english : item.title.romaji
	const image = item.coverImage.large
	const bgColor = item.coverImage.color

	return (
		<CardBox bgColor={bgColor}>
			<Link to={`/anime/${item.id}`}>
				<img
					// style={loaded ? {} : { display: "none" }}
					src={image}
					alt={title}
					onLoad={() => setLoaded(true)}
				/>
				{/* {loaded ? null : <div className="mask"></div>} */}
				<p>{title}</p>
			</Link>
		</CardBox>
	)
}

export const SkeletonCard: FC<{ item: number }> = ({ item }) => {
	return (
		<CardBox key={item}>
			<SkeletonTheme highlightColor="#a7dac7" baseColor="#cad4de">
				<Skeleton key={item} className="mask" />
			</SkeletonTheme>
			<br />
			<SkeletonTheme highlightColor="#a7dac7" baseColor="#cad4de">
				<Skeleton width="120px" height="15px" key={item} />
			</SkeletonTheme>
		</CardBox>
	)
}

const CardBox = styled.div<{ bgColor?: string }>`
	width: 100%;

	a {
		display: block;
		color: ${({ theme }) => theme.text};
	}
	img,
	.mask {
		width: 100%;
		height: auto;
		/* height: 255px; */
		object-fit: cover;
		aspect-ratio: auto 2 / 3;
		border-radius: 8px;
		background: ${({ bgColor }) => bgColor};
	}
	/* @media (max-width: 1100px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 950px) {
		width: 180px;
		img,
		.mask {
			height: 255px;
		}
	}
	@media (max-width: 900px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 720px) {
		width: 130px;
		img,
		.mask {
			height: 180px;
		}
	}
	@media (max-width: 640px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 560px) {
		width: 200px;
		img,
		.mask {
			height: 280px;
		}
	}

	@media (max-width: 480px) {
		width: 180px;
		img,
		.mask {
			height: 255px;
		}
	}
	@media (max-width: 420px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	} */
`
