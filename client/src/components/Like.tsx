import { FC } from "react"
import styled from "styled-components"

const LikeEl = styled.div`
	display: flex;
	align-items: center;
	width: max-content;
	span.count {
		font-size: 1.1rem;
		font-weight: 600;
		margin-right: 5px;
		color: ${({ theme }) => theme.text};
	}
	button.heart {
		font-size: 1.5rem;
		color: #ff5050;
		cursor: pointer;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
			"Open Sans", "Helvetica Neue", sans-serif;
		border: none;
		background: transparent;
		&:disabled {
			color: #636262;
		}
	}
`
interface Props {
	count: number
	isLiked: boolean
	isPending: boolean
	onClick: () => void
}
const Like: FC<Props> = ({ count, isLiked, onClick, isPending }) => {
	const style = {
		className: isLiked ? "heart liked" : "heart unliked",
		iconCode: isLiked ? "&#x2665;" : "&#x2661;",
	}

	return (
		<LikeEl>
			<span className="count">{!!Number(count) && count}</span>
			<button
				onClick={onClick}
				disabled={isPending}
				className={style.className}
				dangerouslySetInnerHTML={{ __html: style.iconCode }}></button>
		</LikeEl>
	)
}
export default Like
