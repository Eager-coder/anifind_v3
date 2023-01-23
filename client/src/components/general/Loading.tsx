import { FC } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import styled from "styled-components"

const LoadingEl = styled.div`
	position: fixed;
	top: 4rem;
	bottom: 2.5rem;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
`
const Loading: FC<{ size: number }> = ({ size }) => {
	return (
		<LoadingEl>
			<ClipLoader color="#70c7a7" size={size || 50} />
		</LoadingEl>
	)
}
export default Loading
