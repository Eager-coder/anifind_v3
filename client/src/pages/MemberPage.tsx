import { FC, memo, useContext, useEffect, useState } from "react"
import LoadingSpinner from "../components/general/LoadingSpinner"
import styled from "styled-components"
import { PrimaryBtn } from "../components/styles/ButtonStyles"
import { RouteComponentProps } from "react-router"
import { UserContext } from "../context/UserContext"
import { AppContext } from "../context/AppContext"
import { Link } from "react-router-dom"
import { H1, H2 } from "../components/styles/Styles"
import { format } from "date-fns"
import useWindowSize from "../utlis/useWindowSize"

interface Props {
	match: {
		params: {
			username: string
		}
	}
	history: RouteComponentProps["history"]
}
interface Member {
	profile: {
		username: string
		user_id: string
		avatar_url: string
		about: string
		created_at: number
	}
	favorite_anime: {
		anime_id: number
		cover_image: string
		title: string
	}[]
	favorite_characters: {
		character_id: number
		cover_image: string
		name: string
	}[]
	followers: {
		username: string
		avatar_url: string
	}[]
	followings: {
		username: string
		avatar_url: string
	}[]
	threads: {
		topic: string
		thread_id: string
	}[]
}
const MemberPage: FC<Props> = ({ match, history }) => {
	const user = useContext(UserContext).user
	const [member, setMember] = useState<Member | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [following, setFollowing] = useState({ isLoading: true, isFollowing: false })
	const [width] = useWindowSize()

	const { client } = useContext(AppContext)
	useEffect(() => {
		if (user.isLoggedIn && user.username === match.params.username) {
			history.replace("/me/profile")
		}
	}, [user.isLoggedIn, match.params.username])
	useEffect(() => {
		setIsLoading(true)
		let isMounted = true
		const getMember = async () => {
			const { data, status } = await client(`/members/${match.params.username}`)
			if (data && isMounted) {
				setMember(data)
				setFollowing({ isLoading: false, isFollowing: data.is_following })
				setIsLoading(false)
			}
			if (status === 404) {
				history.replace("/404")
			}
		}
		getMember()
		return () => {
			isMounted = false
		}
	}, [match.params.username])
	const handleFollow = async () => {
		setFollowing(prev => ({ isFollowing: prev.isFollowing, isLoading: true }))

		const { ok } = await client(`/members/follow/${match.params.username}`, {
			method: "POST",
			shouldShowMessage: "default",
		})
		setFollowing(prev => ({ isFollowing: ok ? true : prev.isFollowing, isLoading: false }))
	}
	const handleUnfollow = async () => {
		setFollowing(prev => ({ isFollowing: prev.isFollowing, isLoading: true }))

		const { ok } = await client(`/members/follow/${match.params.username}`, {
			method: "DELETE",
			shouldShowMessage: "default",
		})
		setFollowing(prev => ({ isFollowing: ok ? false : prev.isFollowing, isLoading: false }))
	}
	if (isLoading) return <LoadingSpinner />
	if (width < 640) {
		return (
			<MemberPageStyle>
				<MobileStyle>
					<div className="user-info-top">
						<div className="avatar">
							<img src={member?.profile.avatar_url || "/assets/images/avatar.png"} alt="" />
						</div>
						<div className="username-date">
							<H1>{member?.profile.username}</H1>
							<p className="member">Member since {format(new Date(user.created_at!), "MMMM y")}</p>
							<PrimaryBtn
								color={following.isFollowing ? "red" : "green"}
								onClick={following.isFollowing ? handleUnfollow : handleFollow}
								isLoading={following.isLoading}
								disabled={following.isLoading}>
								{following.isFollowing ? "Unfollow" : "Follow"}
							</PrimaryBtn>
						</div>
					</div>
					<div className="about">
						<H2>About</H2>
						<p>{member?.profile.about || "Apparently, this user prefers to keep an air of mystery about them."}</p>
					</div>
					<div className="social">
						<div className="followers">
							<H2>Follwers</H2>
							<div className="list">
								{member?.followers.map(follower => (
									<UserLink
										key={follower.username}
										username={follower.username}
										avatar_url={follower.avatar_url}
										isMobile={true}
									/>
								))}
							</div>
						</div>
						<div className="following">
							<H2>Following</H2>
							<div className="list">
								{member?.followings.map(following => (
									<UserLink
										key={following.username}
										username={following.username}
										avatar_url={following.avatar_url}
										isMobile={true}
									/>
								))}
							</div>
						</div>
					</div>
					<div className="favorites">
						<H2>Favorites</H2>
						<h3>Anime</h3>
						<div className="list">
							{member?.favorite_anime?.map(anime => (
								<Card key={anime.anime_id}>
									<Link to={`/anime/${anime.anime_id}`}>
										<img src={anime.cover_image} alt="" />
										<p>{anime.title}</p>
									</Link>
								</Card>
							))}
						</div>
						{member?.favorite_characters.length ? (
							<>
								<h3>Characters</h3>
								<div className="list">
									{member?.favorite_characters?.map(character => (
										<Card key={character.character_id}>
											<Link to={`/characters/${character.character_id}`}>
												<img src={character.cover_image} alt="" />
												<p>{character.name}</p>
											</Link>
										</Card>
									))}
								</div>
							</>
						) : null}
					</div>
					{member?.threads.length && (
						<div className="threads">
							<H2>Threads</H2>
							{member?.threads.map(thread => (
								<Link key={thread.thread_id} to={`/discussions/threads/${thread.thread_id}`}>
									{thread.topic}
								</Link>
							))}
						</div>
					)}
				</MobileStyle>
			</MemberPageStyle>
		)
	}
	return (
		<MemberPageStyle>
			<Aside>
				<div className="avatar-container">
					<img src={member?.profile?.avatar_url || "/assets/images/avatar.png"} alt="" />
				</div>

				<PrimaryBtn
					color={following.isFollowing ? "red" : "green"}
					onClick={following.isFollowing ? handleUnfollow : handleFollow}
					isLoading={following.isLoading}
					disabled={following.isLoading}>
					{following.isFollowing ? "Unfollow" : "Follow"}
				</PrimaryBtn>
				<div className="social">
					<div className="followers">
						<H2>Follwers</H2>
						<div className="list">
							{member?.followers.map(follower => (
								<UserLink key={follower.username} username={follower.username} avatar_url={follower.avatar_url} />
							))}
						</div>
					</div>
					<div className="following">
						<H2>Following</H2>
						<div className="list">
							{member?.followings.map(following => (
								<UserLink key={following.username} username={following.username} avatar_url={following.avatar_url} />
							))}
						</div>
					</div>
				</div>
			</Aside>
			<MainSection>
				<div className="top">
					<H1>{member?.profile.username}'s Profile</H1>
					<p className="member">Member since {format(new Date(user.created_at!), "MMMM y")}</p>
				</div>
				<div className="about">
					<H2>About</H2>
					<p>{member?.profile.about || "Apparently, this user prefers to keep an air of mystery about them."}</p>
				</div>
				<div className="favorites">
					<H2>Favorites</H2>
					<h3>Anime</h3>
					<div className="list">
						{member?.favorite_anime?.map(anime => (
							<Card key={anime.anime_id}>
								<Link to={`/anime/${anime.anime_id}`}>
									<img src={anime.cover_image} alt="" />
									<p>{anime.title}</p>
								</Link>
							</Card>
						))}
					</div>
					{member?.favorite_characters.length ? (
						<>
							<h3>Characters</h3>
							<div className="list">
								{member?.favorite_characters?.map(character => (
									<Card key={character.character_id}>
										<Link to={`/character/${character.character_id}`}>
											<img src={character.cover_image} alt="" />
											<p>{character.name}</p>
										</Link>
									</Card>
								))}
							</div>
						</>
					) : null}
				</div>
				{member?.threads.length ? (
					<div className="threads">
						<H2>Threads</H2>
						{member?.threads.map(thread => (
							<Link key={thread.thread_id} to={`/discussions/threads/${thread.thread_id}`}>
								{thread.topic}
							</Link>
						))}
					</div>
				) : null}
			</MainSection>
		</MemberPageStyle>
	)
}

export default memo(MemberPage)
const UserLink: FC<{ username: string; avatar_url: string; isMobile?: boolean }> = ({
	username,
	avatar_url,
	isMobile = false,
}) => {
	return (
		<UserLinkStyle isMobile={isMobile}>
			<Link key={username} className="user-card" to={`/user/${username}`}>
				<img src={avatar_url || "/assets/images/avatar.png"} alt="" />
				<span>{username}</span>
			</Link>
		</UserLinkStyle>
	)
}
const UserLinkStyle = styled.div<{ isMobile: boolean }>`
	margin-right: ${({ isMobile }) => (isMobile ? "15px" : "10px")};
	width: 50px;
	@media (max-width: 768px) {
		width: ${({ isMobile }) => (isMobile ? "60px" : "40px")};
	}
	a {
		span {
			display: block;
			color: ${({ theme }) => theme.text};
			word-wrap: break-word;
			font-size: 0.9rem;
			@media (max-width: 768px) {
				font-size: 0.75rem;
			}
		}
		img {
			width: 50px;
			height: 50px;
			object-fit: cover;
			object-position: center;
			border-radius: 7px;
			@media (max-width: 768px) {
				width: ${({ isMobile }) => (isMobile ? "60px" : "40px")};
				height: ${({ isMobile }) => (isMobile ? "60px" : "40px")};
			}
		}
	}
`
const MemberPageStyle = styled.section`
	max-width: 1200px;
	padding: 50px;
	margin: auto;
	display: flex;
	@media (max-width: 768px) {
		padding: 20px;
	}
	@media (max-width: 640px) {
		display: block;
	}
`
const MainSection = styled.div`
	width: 100%;
	.about {
		margin: 20px 0;
	}
	h2 {
		margin-bottom: 10px;
	}
	h3 {
		margin: 10px 0;
	}
	.list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, 80px);
		column-gap: 20px;
		row-gap: 20px;
	}
	.threads {
		a {
			font-size: 1.2rem;
			color: ${({ theme }) => theme.text};
		}
	}
`
const Aside = styled.aside`
	margin-right: 100px;
	@media (max-width: 1024px) {
		margin-right: 50px;
	}
	.avatar-container {
		width: 250px;
		height: 250px;
		margin-bottom: 20px;
		@media (max-width: 1024px) {
			width: 180px;
			height: 180px;
		}
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 10px;
		}
	}
	.followers,
	.following {
		margin-top: 20px;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		width: 250px;
		@media (max-width: 1024px) {
			width: 180px;
		}
	}
`

const Card = styled.div`
	width: 80px;
	display: flex;
	flex-direction: column;
	img {
		width: 100%;
		height: 120px;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 5px;
	}
	p {
		font-size: 0.85rem;
		height: 30px;
		margin-bottom: 5px;
		word-wrap: break-word;
	}
`
const MobileStyle = styled.div`
	.user-info-top {
		display: flex;
		.avatar {
			width: 120px;
			img {
				width: 120px;
				height: 120px;
				object-fit: cover;
				border-radius: 10px;
			}
		}
		.username-date {
			height: 120px;
			display: flex;
			flex-direction: column;
			margin-left: 30px;
			p.member {
				font-size: 0.8rem;
			}
			button {
				margin-top: auto;
			}
		}
	}
	h2 {
		margin-top: 20px;
	}
	.social {
		.list {
			display: flex;
			width: 100%;
			overflow-x: auto;
		}
	}
	.favorites {
		.list {
			display: flex;
			width: 100%;
			overflow-x: auto;
			margin: 10px 0;
			> * {
				flex-shrink: 0;
				margin-right: 20px;
			}
		}
	}
	.threads a {
		font-size: 1rem;
		color: ${({ theme }) => theme.text};
	}
`
