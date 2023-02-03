import { FC, useRef } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { H2 } from "../styles/Styles"
interface Props {
	header: string
	list: Array<{
		id: number
		coverImage: {
			extraLarge: string
		}
		title: {
			english: string
			romaji: string
		}
	}>
}
const Carousel: FC<Props> = ({ header, list }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

	const scrollContainer = (direction: "next" | "prev") => {
		if (direction === "next") {
			containerRef.current!.scrollLeft += containerRef.current!.clientWidth
		}
		if (direction === "prev") {
			containerRef.current!.scrollLeft -= containerRef.current!.clientWidth
		}
	}

	return (
		<Section>
			<H2>{header}</H2>
			<img onClick={() => scrollContainer("next")} className="next-btn" src="/assets/icons/right-chevron.svg" alt="" />
			<img onClick={() => scrollContainer("prev")} className="prev-btn" src="/assets/icons/left-chevron.svg" alt="" />
			<div className="carousel">
				<div ref={containerRef} className="card-container">
					{list
						? list.map((item, index) => (
								<Link key={index} to={`/anime/${item.id}`}>
									<div className="card">
										<img className="card-img" src={item.coverImage.extraLarge} alt="" />
										<p>{item.title.english?.slice(0, 50) || item.title.romaji?.slice(0, 50)}</p>
									</div>
								</Link>
						  ))
						: skeletonArray.map(item => (
								<div key={item} className="card">
									<SkeletonTheme highlightColor="#a7dac7" baseColor="#cad4de">
										<Skeleton className="card-img" key={item} />
									</SkeletonTheme>
									<br />
									<SkeletonTheme highlightColor="#a7dac7" baseColor="#cad4de">
										<Skeleton width="120px" height="10px" key={item} />
									</SkeletonTheme>
								</div>
						  ))}
				</div>
			</div>
		</Section>
	)
}
export default Carousel
const Section = styled.section`
	width: 100%;
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	margin-bottom: 50px;
	position: relative;
	h2 {
		margin-bottom: 20px;
	}
	.next-btn,
	.prev-btn {
		cursor: pointer;
		width: 40px;
		padding: 10px;
		background-color: #4c5264;
		border-radius: 50%;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0.4;
		transition: 0.2s;
		&:hover {
			opacity: 1;
		}
	}
	.next-btn {
		right: 0;
	}
	.prev-btn {
		left: 0;
	}
	.card-container {
		display: flex;
		width: 100%;
		scroll-behavior: smooth;
		overflow-x: hidden;
		.card {
			margin-right: 15px;
			width: 150px;
			.card-img {
				border-radius: 7px;
				width: 150px;
				height: 210px;
			}
		}
	}

	@media screen and (max-width: 768px) {
		padding: 0 20px;

		.next-btn,
		.prev-btn {
			width: 40px;
			height: 30px;
			padding: 6px;
			background-color: #4c5264;
			border-radius: 60px;
			position: absolute;
			top: 5%;
		}
		.next-btn {
			right: 20px;
		}
		.prev-btn {
			left: unset;
			right: 70px;
		}
		.carousel {
			overflow-x: hidden;
		}
		.card-container {
			overflow-x: scroll;
			::-webkit-scrollbar-track {
				background-color: ${({ theme }) => theme.scrollbar};
				border-radius: 4px;
			}
			::-webkit-scrollbar {
				border-radius: 4px;
				height: 7px;
				background-color: #f5f5f5;
			}
			::-webkit-scrollbar-thumb {
				background-color: #58a086;
				border-radius: 4px;
			}
		}
	}
	@media screen and (max-width: 480px) {
		margin-bottom: 40px;

		.next-btn,
		.prev-btn {
			width: 35px;
			height: 27px;
			top: 4%;
		}
		.next-btn {
			right: 20px;
		}
		.prev-btn {
			right: 60px;
		}
		.card-container {
			.card {
				width: 120px;
				.card-img {
					width: 120px;
					height: 170px;
				}
				p {
					font-size: 0.85rem;
				}
			}
		}
	}
`
