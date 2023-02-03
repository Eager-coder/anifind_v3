import styled from "styled-components"
import { H2 } from "../styles/Styles"

const EmptyEl = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		max-width: 200px;
		margin-bottom: 20px;
	}
`
const EmptyState = () => {
	return (
		<EmptyEl>
			<img src="/assets/images/no_results.png" alt="" />
			<H2>No results found</H2>
		</EmptyEl>
	)
}

export default EmptyState
