import { formatRelative } from "date-fns"
import { FC, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { H1 } from "../styles/Styles"
interface Thread {
	thread_id: string
	topic: string
	created_at: number
	is_edited: boolean
}
const DiscussionsStyle = styled.section`
	.thread {
		margin-bottom: 15px;
		@media (max-width: 640px) {
			margin-bottom: 10px;
		}
		h2 {
			font-size: 1.5rem;
			margin-bottom: 0;
			@media (max-width: 640px) {
				font-size: 1.1rem;
			}
		}
		span.date {
			color: grey;
			@media (max-width: 640px) {
				font-size: 0.9rem;
			}
		}
	}
`

const Discussions: FC = () => {
	const [threads, setThreads] = useState<Thread[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const { client } = useContext(AppContext)
	useEffect(() => {
		setIsLoading(true)
		let isMounted = true
		const getData = async () => {
			const { data } = await client(`/profile/threads`)
			if (isMounted) {
				setThreads(data)
				setIsLoading(false)
			}
		}
		getData()
		return () => {
			isMounted = false
		}
	}, [])
	return (
		<DiscussionsStyle>
			<H1>Threads</H1>
			{isLoading ? (
				<>Loading...</>
			) : (
				threads?.map(thread => (
					<div className="thread" key={thread.thread_id}>
						<Link to={`/discussions/threads/${thread.thread_id}`}>
							<h2>{thread.topic}</h2>
						</Link>
						<span className="date">
							{formatRelative(new Date(thread.created_at * 1000), new Date())}{" "}
							{thread.is_edited && "(edited)"}
						</span>
					</div>
				))
			)}
		</DiscussionsStyle>
	)
}
export default Discussions
