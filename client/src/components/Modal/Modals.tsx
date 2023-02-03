import { FC, useContext, useState } from "react"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import styled, { css } from "styled-components"
import { AppContext } from "../../context/AppContext"
import { UserContext } from "../../context/UserContext"
import { useHistory } from "react-router"
import { H2 } from "../styles/Styles"

// const PrimaryBtnStyle = css`
// 	padding: 5px;
// `.toString()
// export const ChangeUsernameModal: FC = () => {
// 	const [newUsername, setNewUsername] = useState("")
// 	const [isLoading, setIsLoading] = useState(false)
// 	const { hideModal, client } = useContext(AppContext)
// 	const { changeUserData } = useContext(UserContext)

// 	const handleSubmit = async () => {
// 		setIsLoading(true)
// 		const { ok } = await client("/user/update/username", {
// 			method: "PUT",
// 			body: {
// 				data: newUsername,
// 			},
// 			shouldShowMessage: "default",
// 		})

// 		if (ok) {
// 			changeUserData("username", newUsername)
// 		}
// 		setIsLoading(false)
// 	}
// 	return (
// 		<>
// 			<H2>Change username</H2>
// 			<Input
// 				type="text"
// 				value={newUsername}
// 				onChange={e => setNewUsername(e.target.value)}
// 				placeholder="New username"
// 			/>
// 			<div className="buttons">
// 				<SecondaryBtn className="cancel" onClick={() => hideModal()} disabled={isLoading}>
// 					Cancel
// 				</SecondaryBtn>
// 				<PrimaryBtn onClick={handleSubmit} disabled={isLoading} isLoading={isLoading}>
// 					Submit
// 				</PrimaryBtn>
// 			</div>
// 		</>
// 	)
// }
// export const ChangeEmailModal = () => {
// 	const [newEmail, setNewEmail] = useState("")
// 	const [isLoading, setIsLoading] = useState(false)
// 	const { hideModal, client } = useContext(AppContext)
// 	const { changeUserData } = useContext(UserContext)

// 	const handleSubmit = async () => {
// 		setIsLoading(true)
// 		const { ok } = await client("/user/update/email", {
// 			method: "PUT",
// 			body: {
// 				data: newEmail,
// 			},
// 			shouldShowMessage: "default",
// 		})

// 		if (ok) {
// 			changeUserData("username", newEmail)
// 		}
// 		setIsLoading(false)
// 	}

// 	return (
// 		<>
// 			<H2>Change email</H2>
// 			<Input
// 				type="text"
// 				value={newEmail}
// 				onChange={e => setNewEmail(e.target.value)}
// 				placeholder="New email"
// 			/>
// 			<div className="buttons">
// 				<SecondaryBtn className="cancel" onClick={() => hideModal()} disabled={isLoading}>
// 					Cancel
// 				</SecondaryBtn>
// 				<PrimaryBtn onClick={handleSubmit} disabled={isLoading} isLoading={isLoading}>
// 					Submit
// 				</PrimaryBtn>
// 			</div>
// 		</>
// 	)
// }
export const ChangePasswordModal = () => {
	const { hideModal, client, showModalMessage } = useContext(AppContext)
	const [isLoading, setIsLoading] = useState(false)
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [newPassword2, setNewPassword2] = useState("")

	const handleSubmit = async () => {
		setIsLoading(true)
		if (newPassword !== newPassword2) {
			setIsLoading(false)

			return showModalMessage(`Passwords don't match`, false)
		}

		const { ok } = await client("/user/update/password", {
			method: "PUT",
			body: {
				oldPassword,
				newPassword,
			},
			shouldShowMessage: "default",
		})
		if (ok) {
			hideModal()
		}
		setIsLoading(false)
	}
	return (
		<>
			<H2>Change password</H2>
			<Input
				type="password"
				value={oldPassword}
				onChange={e => setOldPassword(e.target.value)}
				placeholder="Current password"
			/>
			<Input
				type="password"
				value={newPassword}
				onChange={e => setNewPassword(e.target.value)}
				placeholder="New password"
			/>
			<Input
				type="password"
				value={newPassword2}
				onChange={e => setNewPassword2(e.target.value)}
				placeholder="Confirm new password"
			/>
			<div className="buttons">
				<SecondaryBtn className="cancel" onClick={() => hideModal()} disabled={isLoading}>
					Cancel
				</SecondaryBtn>
				<PrimaryBtn onClick={handleSubmit} disabled={isLoading} isLoading={isLoading}>
					Submit
				</PrimaryBtn>
			</div>
		</>
	)
}
export const DeleteCommentModal = () => {
	const [isLoading, setIsLoading] = useState(false)
	const { hideModal, modal, client } = useContext(AppContext)
	const { comment, getComments, type } = modal.props

	const handleDelete = async () => {
		setIsLoading(true)
		const { ok } = await client(`/${type}/comments/${comment.comment_id}`, {
			method: "DELETE",
			shouldShowMessage: "default",
		})
		if (ok) {
			await getComments()
		}

		setIsLoading(false)
		hideModal()
	}
	return (
		<>
			<H2>Delete comment</H2>
			<p>
				Are you sure you want to delete the comment? <br />
				<span>{comment.text}</span>
			</p>
			<div className="buttons">
				<SecondaryBtn onClick={hideModal} className="cancel" disabled={isLoading}>
					Cancel
				</SecondaryBtn>
				<PrimaryBtn onClick={handleDelete} disabled={isLoading} isLoading={isLoading}>
					Delete
				</PrimaryBtn>
			</div>
		</>
	)
}

export const DeleteThreadModal = () => {
	const { hideModal, modal, client } = useContext(AppContext)

	const { thread, getThread, history } = modal.props
	const [isLoading, setIsLoading] = useState(false)

	const handleDelete = async () => {
		setIsLoading(true)
		const { ok, data } = await client(`/discussions/threads/${thread.thread_id}`, {
			method: "DELETE",
			shouldShowMessage: "default",
		})
		setIsLoading(false)
		if (ok) {
			if (data.status === "hard_delete") {
				history.replace("/discussions")
			} else {
				getThread()
			}
			hideModal()
		}
	}

	return (
		<>
			<H2>Delete thread</H2>
			<p>
				Are you sure you want to delete the thread? <br />
				<span>{thread.topic}</span>
			</p>
			<div className="buttons">
				<SecondaryBtn onClick={hideModal} className="cancel" disabled={isLoading}>
					Cancel
				</SecondaryBtn>
				<PrimaryBtn onClick={handleDelete} disabled={isLoading} isLoading={isLoading}>
					Delete
				</PrimaryBtn>
			</div>
		</>
	)
}
export const DeletePostModal = () => {
	const { hideModal, modal, client } = useContext(AppContext)

	const [isLoading, setIsLoading] = useState(false)

	const { post, getPosts } = modal.props

	const handleDeletePost = async () => {
		setIsLoading(true)
		const { ok } = await client(`/discussion/post/${post.post_id}`, {
			method: "DELETE",
			shouldShowMessage: "default",
		})
		if (ok) {
			getPosts()
		}

		setIsLoading(false)
		hideModal()
	}
	return (
		<>
			<H2>Delete post</H2>
			<p>
				Are you sure you want to delete this post? <br />
				<span>{post.body}</span>
			</p>
			<div className="buttons">
				<SecondaryBtn onClick={() => hideModal()} className="cancel" disabled={isLoading}>
					Cancel
				</SecondaryBtn>
				<PrimaryBtn onClick={handleDeletePost} disabled={isLoading} isLoading={isLoading}>
					Delete
				</PrimaryBtn>
			</div>
		</>
	)
}
export const OpenThreadModal: FC = () => {
	const [topic, setTopic] = useState("")
	const [body, setBody] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const { client } = useContext(AppContext)
	const history = useHistory()
	const { hideModal } = useContext(AppContext)
	const handleSubmit = async () => {
		setIsLoading(true)
		const { data, ok } = await client("/discussions/threads/", {
			method: "POST",
			body: { topic, body },
			shouldShowMessage: "error",
		})

		if (ok) {
			hideModal()
			history.push(`/discussions/threads/${data.thread_id}`)
		}

		setIsLoading(false)
	}

	return (
		<>
			<H2>Open a Thread</H2>
			<Input
				type="text"
				placeholder="Thread Topic"
				defaultValue={topic}
				onChange={e => setTopic(e.target.value)}
				disabled={isLoading}
			/>
			<Textarea
				placeholder="What to you want to discuss?"
				defaultValue={body}
				disabled={isLoading}
				onChange={e => setBody(e.target.value)}></Textarea>
			<div className="buttons">
				<SecondaryBtn onClick={hideModal} className="cancel" disabled={isLoading}>
					Cancel
				</SecondaryBtn>
				<PrimaryBtn onClick={handleSubmit} disabled={isLoading}>
					Create a thread
				</PrimaryBtn>
			</div>
		</>
	)
}

const Input = styled.input`
	display: block;
	min-width: 300px;
	width: 100%;
	height: 30px;
	margin: 25px 0;
	padding: 0 5px;
	position: relative;
	border: none;
	border-radius: 4px;
	font-size: 1.1rem;
	box-shadow: 0px 0px 5px rgb(0 0 0 / 5%);
	background-color: white;
	@media (max-width: 640px) {
		font-size: 0.95rem;
	}
`
const Textarea = styled.textarea`
	margin: 5px 0;
	padding: 5px;
	width: 600px;
	height: 300px;
	font-size: 1rem;
	border-radius: 4px;
	border: none;
	@media (max-width: 640px) {
		font-size: 0.9rem;
	}
`
