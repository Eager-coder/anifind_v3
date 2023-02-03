import { FC, memo, useState } from "react"
import { RouteComponentProps } from "react-router"
import styled from "styled-components"
import Posts from "../../components/Discussions/Posts"
import Thread, { ThreadType } from "../../components/Discussions/Thread"
type Props = {
	match: {
		params: {
			thread_id: string
		}
	}
	history: RouteComponentProps["history"]
}
const DiscussionPage: FC<Props> = ({ match, history }) => {
	const [thread, setThread] = useState<ThreadType>({
		thread_id: match.params.thread_id,
	})
	return (
		<PageEl>
			<>
				<Thread thread={thread} setThread={setThread} history={history} />
				<Posts thread={thread} />
			</>
		</PageEl>
	)
}
export default DiscussionPage
const PageEl = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 0 50px;
	margin: 30px auto;
	@media (max-width: 768px) {
		padding: 0 20px;
	}
`
