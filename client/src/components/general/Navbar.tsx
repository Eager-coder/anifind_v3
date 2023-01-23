import { FC, memo, useContext, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { UserContext } from "../../context/UserContext"
import useWindowSize from "../../utlis/useWindowSize"

interface Props {
	theme: "light" | "dark"
	switchTheme: (theme: Props["theme"]) => void
}
const Navbar: FC<Props> = ({ theme, switchTheme }) => {
	const { user } = useContext(UserContext)

	const handleSwitchTheme = () => {
		switchTheme(theme === "light" ? "dark" : "light")
	}
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [width] = useWindowSize()
	return (
		<Nav>
			<div className="nav-container">
				<NavLink to="/">
					<span className="logo">Ani</span>
				</NavLink>

				{width > 640 ? (
					<>
						<div className="nav-links">
							<NavLink to="/">Home</NavLink>
							<NavLink to="/search?year=2021">Browse</NavLink>
							<NavLink to="/discussions">Discussions</NavLink>
						</div>

						<div className="user-links">
							<img onClick={handleSwitchTheme} src={`/assets/icons/${theme === "dark" ? "moon" : "sun"}.svg`} alt="" />
							{user.isLoggedIn ? (
								<NavLink to={`/me/profile`}>{user.username}</NavLink>
							) : (
								<>
									<NavLink to="/login">Login</NavLink> <span className="vertical-bar">|</span>{" "}
									<NavLink to="/register">Register</NavLink>
								</>
							)}
						</div>
					</>
				) : (
					<img onClick={() => setIsMenuOpen(true)} className="menu" src="/assets/icons/Menu.svg" alt="Menu" />
				)}
			</div>
			{isMenuOpen && width < 640 && (
				<MobileMenuStyle>
					<div className="links">
						<NavLink to="/" onClick={() => setIsMenuOpen(false)}>
							<img src={`/assets/icons/nav-mobile-${theme}/Home.svg`} alt="" />
							<span>Home</span>
						</NavLink>
						<NavLink to="/discussions" onClick={() => setIsMenuOpen(false)}>
							<img src={`/assets/icons/nav-mobile-${theme}/Message.svg`} alt="" />
							<span>Discussion</span>
						</NavLink>
						<img
							onClick={() => setIsMenuOpen(false)}
							id="close"
							src={`/assets/icons/nav-mobile-${theme}/Close.svg`}
							alt=""
						/>
						<NavLink to="/search?year=2021" onClick={() => setIsMenuOpen(false)}>
							<img src={`/assets/icons/nav-mobile-${theme}/Search.svg`} alt="" />
							<span>Search</span>
						</NavLink>
						{user.isLoggedIn ? (
							<NavLink to="/me/profile" onClick={() => setIsMenuOpen(false)}>
								<img src={`/assets/icons/nav-mobile-${theme}/User.svg`} alt="" />
								<span>Profile</span>
							</NavLink>
						) : (
							<NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
								<img src={`/assets/icons/nav-mobile-${theme}/User.svg`} alt="" />
								<span>Login</span>
							</NavLink>
						)}
						<div onClick={handleSwitchTheme} className="theme">
							<img src={`/assets/icons/nav-mobile-${theme}/Moon.svg`} alt="" />
							<span>Theme</span>
						</div>
					</div>
				</MobileMenuStyle>
			)}
		</Nav>
	)
}
export default memo(Navbar)

const Nav = styled.nav`
	width: 100%;
	/* background-color: #4c5264; //current color */
	background-color: #32343b;
	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 50px;
		width: 100%;
		max-width: 1200px;
		height: 4rem;
		margin: auto;
		@media screen and (max-width: 768px) {
			height: 3.5rem;
			padding: 0 20px;
		}
		span.logo {
			cursor: pointer;
			border-radius: 7px;
			font-size: 2.5rem;
			font-weight: 600;
			color: white;
			&::after {
				content: "Find";
				color: #70c7a7;
			}
			@media screen and (max-width: 768px) {
				font-size: 2rem;
			}
			@media (max-width: 640px) {
				font-size: 1.8rem;
			}
		}
		.nav-links {
			display: flex;
			> a {
				color: whitesmoke;
				margin-right: 20px;
				font-size: 1.1rem;
				font-weight: 550;
				:active {
					color: white;
				}
				@media (max-width: 768px) {
					margin-right: 15px;
					font-size: 1rem;
					font-weight: 500;
				}
			}
		}
	}
	.user-links {
		display: flex;
		align-items: center;
		color: white;
		a {
			font-size: 1.2rem;
			color: white;
			font-weight: 600;
			border-bottom: 2px #70c7a7 solid;
			@media (max-width: 768px) {
				font-size: 1.1rem;
			}
		}
		img {
			cursor: pointer;
			height: 25px;
			filter: invert(1);
			margin-right: 20px;
		}
		span.vertical-bar {
			margin: 0 5px;
		}
	}
	img.menu {
		width: 28px;
		height: 28px;
		cursor: pointer;
	}
`
const MobileMenuStyle = styled.div`
	width: 210px;
	height: 140px;
	position: fixed;
	z-index: 5;
	top: 20px;
	right: 20px;
	background: ${({ theme }) => theme.commentBg};
	border-radius: 10px;
	box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.15);
	display: flex;
	justify-content: space-between;
	padding: 10px;
	.links {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		justify-items: center;
		align-items: center;
		width: 100%;
		height: 100%;
		a,
		.theme {
			display: flex;
			flex-direction: column;
			align-items: center;
			img {
				width: 32px;
				height: 32px;
			}
			span {
				font-size: 0.7rem;
				color: ${({ theme }) => theme.header};
				font-weight: 600;
			}
		}
		> #close {
			cursor: pointer;
			width: 32px;
			height: 32px;
			position: relative;
			top: -4px;
		}
	}
`
