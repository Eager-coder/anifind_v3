import { useState, useEffect, FC, KeyboardEvent } from "react"
import { RouteComponentProps } from "react-router-dom"
import styled from "styled-components"
import getUrlObj from "../../utlis/getUrlObj"
import { H2 } from "../styles/Styles"

type Props = {
	location: RouteComponentProps["location"]
	history: RouteComponentProps["history"]
}
const SearchBox: FC<Props> = ({ location, history }) => {
	const [query, setQuery] = useState(getUrlObj(location.search).query || "")

	useEffect(() => {
		const searchObj = getUrlObj(location.search)
		if (!searchObj.query) {
			setQuery("")
		}
	}, [location])

	const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && query.trim()) {
			const newParams = { ...getUrlObj(location.search), query: query.trim() }
			const url = new URLSearchParams(newParams).toString()
			history.push("/search?" + url)
		}
	}

	return (
		<SearchBoxEl>
			<H2>Search anime</H2>
			<div className="input-container">
				<img src="https://img.icons8.com/ios-glyphs/100/000000/search.png" alt="search" />
				<input
					type="text"
					value={query}
					onChange={e => setQuery(() => e.target.value)}
					onKeyDown={handleSubmit}
				/>
			</div>
		</SearchBoxEl>
	)
}
export default SearchBox
const SearchBoxEl = styled.div`
	width: 100%;
	margin-top: 50px;
	h2 {
		/* font-size: 2.5rem; */
		margin-bottom: 10px;
	}
	.input-container {
		width: 100%;
		height: 40px;
		position: relative;
		border: none;
		box-shadow: ${({ theme }) => theme.boxShadow};
		border-radius: 7px;
		background-color: white;
		img {
			width: 23px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 15px;
			filter: invert(0.7);
		}
		input {
			height: 100%;
			width: 100%;
			border: none;
			background: transparent;
			font-size: 1.1rem;
			font-weight: 300;
			padding-left: 50px;
			color: #4c5264;
		}
	}

	@media (max-width: 768px) {
		margin: 20px 0;
		h2 {
			/* font-size: 1.7rem; */
		}
		.input-container {
			height: 30px;
			input {
				font-size: 1rem;
				padding-left: 40px;
			}
			img {
				left: 10px;
			}
		}
	}
`
