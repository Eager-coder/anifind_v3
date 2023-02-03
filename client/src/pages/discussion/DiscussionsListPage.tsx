import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn } from "../../components/styles/ButtonStyles"
import { H1 } from "../../components/styles/Styles"
import UserLink from "../../components/UserLink"
import { AppContext } from "../../context/AppContext"
import useWindowSize from "../../utlis/useWindowSize"
type Thread = {
	thread_id: string
	avatar_url: string
	username: string
	topic: string
	body: string
	created_at: number
}
export default function DiscussionListPage() {
	const [threads, setThreads] = useState<Thread[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { showModal, client } = useContext(AppContext)
	const [width] = useWindowSize()
	useEffect(() => {
		let isMounted = true
		client("/discussions/threads").then(({ data }) => {
			if (isMounted) {
				setThreads(data)
				setIsLoading(false)
			}
		})
		return () => {
			isMounted = false
		}
	}, [])
	return (
		<PageEl>
			<Header>
				<H1>Discussions</H1>
				<PrimaryBtn size={width > 768 ? "medium" : "small"} onClick={() => showModal("OPEN_THREAD", null)}>
					Open a Thread
				</PrimaryBtn>
			</Header>
			<p className="intro">Join open discussions about anime or open your own thread.</p>

			{!isLoading && threads.length
				? threads.map(thread => (
						<ThreadCard key={thread.thread_id}>
							<Link className="thread-link" to={`/discussions/threads/${thread.thread_id}`}>
								<h2>{thread.topic}</h2>
								<p>{thread.body}</p>
							</Link>
							<UserLink username={thread.username} avatar_url={thread.avatar_url} date={thread.created_at} />
						</ThreadCard>
				  ))
				: "Loading..."}
		</PageEl>
	)
}
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	button {
		flex-shrink: 0;
	}
`
const PageEl = styled.div`
	max-width: 1200px;
	padding: 50px;
	margin: auto;
	@media (max-width: 768px) {
		padding: 20px;
	}

	p.intro {
		font-size: 1.1rem;
		margin-bottom: 20px;
		@media (max-width: 768px) {
			font-size: 1rem;
		}
		@media (max-width: 640px) {
			font-size: 0.9rem;
		}
	}
`
const ThreadCard = styled.div`
	background: ${({ theme }) => theme.commentBg};
	border-radius: 4px;
	padding: 20px;
	margin: 20px 0;
	a.thread-link {
		h2 {
			font-size: 1.5rem;
			color: ${({ theme }) => theme.text};
			font-weight: 700;
			@media (max-width: 768px) {
				font-size: 1.2rem;
			}
			@media (max-width: 640px) {
				font-size: 1.1rem;
			}
		}
		p {
			margin: 10px 0;
			@media (max-width: 640px) {
				font-size: 0.9rem;
			}
		}
	}
`
