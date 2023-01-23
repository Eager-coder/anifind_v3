import { FC } from "react"
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
const EmptyState: FC<{ src: string; header: string }> = ({ src, header }) => {
	return (
		<EmptyEl>
			<img src={src} alt="" />
			<H2>{header}</H2>
		</EmptyEl>
	)
}
export default EmptyState
