import { formatDistanceStrict } from "date-fns"
import { FC } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
type Props = {
	username: string
	avatar_url: string
	date: number
	isEdited?: boolean
}
const UserLink: FC<Props> = ({ username, avatar_url, date, isEdited }) => {
	return (
		<Container>
			<Link className="user" to={`/user/${username}`}>
				<img src={avatar_url || "/assets/images/avatar.png"} alt="" />
				<div className="username-date">
					<span className="username">{username}</span>
					{!!date && (
						<span className="date">
							{formatDistanceStrict(new Date(date * 1000), new Date(), {
								addSuffix: true,
							})}
							{isEdited && <span className="edited">(edited)</span>}
						</span>
					)}
				</div>
			</Link>
		</Container>
	)
}
export default UserLink
const Container = styled.div`
	display: flex;
	align-items: center;
	.username-date {
		display: flex;
		flex-direction: column;
	}
	.user {
		display: flex;
		align-items: center;
		margin-right: 15px;
		img {
			width: 40px;
			height: 40px;
			border-radius: 7px;
			margin-right: 10px;
		}
		span.username {
			font-size: 1rem;
			color: #70c7a7;
		}
	}
	span.date,
	span.edited {
		font-size: 0.8rem;
		color: grey;
	}
	.edited {
		margin-left: 5px;
	}
	@media (max-width: 768px) {
		.user {
			img {
				width: 30px;
				height: 30px;
			}
			span.username {
				font-size: 0.8rem;
			}
		}
		span.date,
		span.edited {
			font-size: 0.75rem;
		}
	}
`
