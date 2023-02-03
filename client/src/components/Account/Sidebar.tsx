import { FC } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Sidebar: FC<{ category: string }> = ({ category }) => {
	return (
		<SideNav>
			<ul className="links">
				<li className={category === "profile" ? "link-active" : "link"}>
					<Link to="/me/profile">Profile</Link>
				</li>
				<li className={category === "favorites" ? "link-active" : "link"}>
					<Link to="/me/favorites">Favorites</Link>
				</li>
				<li className={category === "comments" ? "link-active" : "link"}>
					<Link to="/me/comments">Comments</Link>
				</li>
				<li className={category === "discussions" ? "link-active" : "link"}>
					<Link to="/me/discussions">Discussions</Link>
				</li>
				<li className={category === "settings" ? "link-active" : "link"}>
					<Link to="/me/settings">Settings</Link>
				</li>
				<li className={category === "social" ? "link-active" : "link"}>
					<Link to="/me/social">Social</Link>
				</li>
				<li className={category === "messages" ? "link-active" : "link"}>
					<Link to="/me/messages">Messages</Link>
				</li>
			</ul>
		</SideNav>
	)
}
export default Sidebar

const SideNav = styled.aside`
	border-radius: 7px;
	margin-right: 100px;
	width: 200px;
	height: max-content;
	.links {
		list-style: none;
		li {
			width: max-content;
			a {
				display: block;
				width: max-content;
				margin: 10px 0;
				font-size: 1.5rem;
			}
		}
	}
	.link {
		a {
			color: ${({ theme }) => theme.header};
		}
	}
	.link-active {
		a {
			border-left: #70c7a7 4px solid;
			padding-left: 20px;
			color: #70c7a7;
		}
	}
	@media (max-width: 1024px) {
		margin-right: 50px;
	}
	@media (max-width: 768px) {
		width: 100%;
		margin-bottom: 20px;
		.links {
			display: flex;
			justify-content: space-between;
			overflow-x: auto;
			> :last-child {
				margin-right: 0 !important;
			}
			li {
				margin-right: 25px;
				a {
					font-size: 1rem;
				}
			}
		}
		.link-active {
			a {
				border-left: none;
				padding-left: 0px;
				color: #70c7a7;
			}
		}
	}
`
