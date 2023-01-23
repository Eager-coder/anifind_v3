import { useState, useEffect, useRef, memo, useContext, FC } from "react"
import styled from "styled-components"
import { format, parseISO } from "date-fns"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { UserContext } from "../../context/UserContext"
import { AppContext } from "../../context/AppContext"
import { H1, H2 } from "../styles/Styles"
import "react-loading-skeleton/dist/skeleton.css"

const Profile: FC = () => {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const { user, setUser } = useContext(UserContext)
	const { client } = useContext(AppContext)
	const { isLoading } = user
	const [newAbout, setNewAbout] = useState(user.about || "")
	const [isAboutPending, setIsAboutPending] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const handleLogout = async () => {
		const { ok } = await client(`/auth/logout`, {
			method: "DELETE",
			shouldShowMessage: "default",
		})
		if (ok) {
			localStorage.removeItem("access_token")
			window.location.replace("/")
		}
	}

	useEffect(() => {
		if (isEditOpen && textareaRef.current) {
			textareaRef.current.focus()
		}
	}, [isEditOpen])

	const handleUpdateAbout = async () => {
		setIsAboutPending(true)
		const { ok } = await client("/profile/about", {
			method: "PUT",
			shouldShowMessage: "default",
			body: { new_about: newAbout },
		})
		if (ok) {
			setIsAboutPending(false)
			setUser()
		}
	}
	return (
		<ProfileEl>
			<H1>Profile</H1>
			<div className="top">
				<div className="avatar">
					<img src={user.avatar_url || "/assets/images/avatar.png"} alt="" />
				</div>
				<div className="text">
					<H2>{user.username}</H2>

					{isLoading || !user.created_at ? (
						<SkeletonTheme highlightColor="#f5f5f5" baseColor="#c4c4c4">
							<Skeleton width="7rem" height="10px" />
						</SkeletonTheme>
					) : (
						<p>Member since {format(new Date(user.created_at!), "MMMM y")}</p>
					)}
				</div>
			</div>
			<div className="about-user">
				<div className="about-header">
					<H2>About me</H2>

					{isEditOpen ? (
						<SecondaryBtn onClick={() => setIsEditOpen(false)} isLoading={isAboutPending} disabled={isAboutPending}>
							Cancel
						</SecondaryBtn>
					) : (
						<SecondaryBtn onClick={() => setIsEditOpen(true)} isLoading={isAboutPending} disabled={isAboutPending}>
							Edit
						</SecondaryBtn>
					)}
				</div>
				{isEditOpen ? (
					<div className="edit-about">
						<textarea ref={textareaRef} value={newAbout} onChange={e => setNewAbout(e.target.value)}></textarea>
						<PrimaryBtn isLoading={isAboutPending} disabled={isAboutPending} onClick={handleUpdateAbout}>
							Submit
						</PrimaryBtn>
					</div>
				) : (
					<>
						{isLoading ? (
							<SkeletonTheme highlightColor="#f5f5f5" baseColor="#c4c4c4">
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
							</SkeletonTheme>
						) : (
							<p>{user.about ? user.about : "Write about yourself"}</p>
						)}
					</>
				)}
				<SecondaryBtn color="red" onClick={handleLogout} customStyle="margin-top: 20px;">
					Logout
				</SecondaryBtn>
			</div>
		</ProfileEl>
	)
}
export default memo(Profile)

const ProfileEl = styled.section`
	width: 100%;

	.top {
		display: flex;
		margin-bottom: 50px;
		.avatar {
			margin-right: 50px;
			img {
				width: 180px;
				height: 180px;
				border-radius: 5px;
				object-fit: cover;
			}
		}
	}
	.about-user {
		.about-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		p {
			background: ${({ theme }) => theme.commentBg};
			border-radius: 4px;
			padding: 10px;
		}
	}
	.edit-about {
		width: 100%;
		textarea {
			width: 100%;
			min-height: 200px;
			height: max-content;
			border: none;
			border-radius: 4px;
			padding: 10px;
			margin: 10px 0;
			font-size: 1rem;
			color: ${({ theme }) => theme.text};
			background: ${({ theme }) => theme.commentBg};
		}
	}
	@media (max-width: 480px) {
		.top {
			.avatar {
				margin-right: 30px;
				img {
					width: 130px;
					height: 130px;
				}
			}
			.text {
				p {
					font-size: 0.9rem;
				}
			}
		}
	}
`
