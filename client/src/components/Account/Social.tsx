import { FC, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { H1, H2 } from "../styles/Styles"

// const UserCard = styled.div``
interface Relation {
	followings: {
		username: string
		avatar_url: string
	}[]
	followers: {
		username: string
		avatar_url: string
	}[]
}
const Social: FC = () => {
	const [relation, setRelation] = useState<Relation | null>(null)
	const { client } = useContext(AppContext)

	const getRelation = async () => {
		const { ok, data } = await client(`/profile/follows`)
		if (ok) {
			setRelation(data)
		}
	}
	useEffect(() => {
		getRelation()
	}, [])

	return (
		<SocialEl>
			<H1>Social</H1>
			<H2>Following</H2>
			<div className="list">
				{relation?.followings?.map(following => (
					<Link key={following.username} className="user-link" to={`/user/${following.username}`}>
						<img src={following.avatar_url || "/assets/images/avatar.png"} alt="" />
						<p>{following.username}</p>
					</Link>
				))}
			</div>

			<H2>Followers</H2>
			<div className="list">
				{relation?.followers.map(follower => (
					<Link key={follower.username} className="user-link" to={`/user/${follower.username}`}>
						<img src={follower.avatar_url || "/assets/images/avatar.png"} alt="" />
						<p>{follower.username}</p>
					</Link>
				))}
			</div>
		</SocialEl>
	)
}
export default Social

const SocialEl = styled.div`
	.list {
		display: flex;
	}
	.user-link {
		width: 100px;
		margin-right: 10px;
		display: block;
		img {
			width: 100%;
			border-radius: 10px;
			aspect-ratio: 1 / 1;
			object-fit: cover;
		}
	}
`
