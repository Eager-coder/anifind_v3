import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { H2 } from "../styles/Styles"

const Characters = ({ data }: any) => {
	if (!data.hasOwnProperty("characters")) return null
	return (
		<Section>
			<H2>Main characters</H2>
			<div className="characters-container">
				{data.characters.edges.map(
					({
						node: {
							name: { full: name },
							image,
							id,
						},
					}: any) => (
						<Link to={`/character/${id}`} key={id}>
							<div className="character-card">
								<img src={image.large} alt={name} />
								<p>{name}</p>
							</div>
						</Link>
					)
				)}
			</div>
		</Section>
	)
}
export default Characters
const Section = styled.section`
	max-width: 1200px;
	padding: 0 50px;
	margin: 20px auto;
	h2 {
		margin: 20px 0;
	}
	.characters-container {
		display: grid;
		grid-template-columns: repeat(6, minmax(120px, 1fr));
		justify-content: space-between;
		column-gap: 20px;
		row-gap: 20px;
		.character-card {
			img {
				border-radius: 5px;
				width: 100%;
				height: 210px;
				object-fit: cover;
			}
		}
	}
	@media screen and (max-width: 1024px) {
		.characters-container {
			grid-template-columns: repeat(5, minmax(120px, 1fr));
		}
	}
	@media screen and (max-width: 900px) {
		.characters-container {
			.character-card {
				img {
					height: 200px;
				}
			}
		}
	}
	@media screen and (max-width: 768px) {
		padding: 0 20px;

		.characters-container {
			grid-template-columns: repeat(4, minmax(100px, 1fr));
		}
	}
	@media screen and (max-width: 620px) {
		.characters-container {
			grid-template-columns: repeat(4, minmax(80px, 1fr));
			.character-card {
				img {
					height: 150px;
				}
			}
		}
	}
	@media screen and (max-width: 480px) {
		.characters-container {
			grid-template-columns: repeat(3, 1fr);
			.character-card {
				p {
					font-size: 0.8rem;
				}
				img {
					height: 170px;
				}
			}
		}
	}
	@media screen and (max-width: 400px) {
		.characters-container {
			grid-template-columns: repeat(3, 1fr);
			.character-card {
				img {
					height: 140px;
				}
			}
		}
	}
`
