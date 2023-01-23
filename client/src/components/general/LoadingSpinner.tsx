import { FC } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import styled from "styled-components"

const LoadingEl = styled.div<{ padding: number }>`
	width: 100%;
	padding-top: ${({ padding }) => padding || "0"}px;
	display: flex;
	justify-content: center;
	align-items: center;
`
type Props = {
	size?: number
	padding?: number
}
const LoadingSpinner: FC<Props> = ({ size, padding = 0 }) => {
	return (
		<LoadingEl padding={padding}>
			<ClipLoader color="#70c7a7" size={size || 50} />
		</LoadingEl>
	)
}
export default LoadingSpinner
