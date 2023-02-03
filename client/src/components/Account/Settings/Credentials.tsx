import { useContext, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/AppContext"
import { UserContext } from "../../../context/UserContext"
import { PrimaryBtn, SecondaryBtn } from "../../styles/ButtonStyles"
import { H2 } from "../../styles/Styles"
interface Edit {
	isOpen: boolean
	type: "none" | "username" | "email"
}
export default function Credentials() {
	const { user, setUser } = useContext(UserContext)
	const { showModal, client } = useContext(AppContext)
	const [edit, setEdit] = useState<Edit>({ isOpen: false, type: "none" })
	const [newUsername, setNewUsername] = useState({ text: "", isPending: false })
	const [newEmail, setNewEmail] = useState({ text: "", isPending: false })

	const handleSubmitUsername = async () => {
		setNewUsername(prev => ({ ...prev, isPending: true }))
		const { ok } = await client("/profile/username", {
			method: "PUT",
			shouldShowMessage: "default",
			body: { new_username: newUsername.text.trim() },
		})
		setNewUsername(prev => ({ ...prev, isPending: false }))
		if (ok) {
			setUser()
		}
	}
	const handleSubmitEmail = async () => {
		setNewEmail(prev => ({ ...prev, isPending: true }))
		const { ok } = await client("/user/update/email", {
			method: "PUT",
			shouldShowMessage: "default",
			body: { newEmail: newEmail.text.trim() },
		})
		setNewEmail(prev => ({ ...prev, isPending: false }))
		if (ok) {
			setUser()
		}
	}
	return (
		<Container>
			<div className="username">
				<div className="top">
					<H2>Username</H2>
					{edit.isOpen && edit.type === "username" ? (
						<div className="buttons">
							<SecondaryBtn
								isLoading={newUsername.isPending}
								disabled={newUsername.isPending}
								onClick={() => setEdit({ isOpen: false, type: "none" })}>
								Cancel
							</SecondaryBtn>
							<PrimaryBtn
								isLoading={newUsername.isPending}
								disabled={newUsername.isPending}
								onClick={handleSubmitUsername}>
								Submit
							</PrimaryBtn>
						</div>
					) : (
						<SecondaryBtn size="medium" onClick={() => setEdit({ isOpen: true, type: "username" })}>
							Change
						</SecondaryBtn>
					)}
				</div>
				{edit.isOpen && edit.type === "username" ? (
					<Input
						disabled={newEmail.isPending}
						value={newUsername.text}
						onChange={e => setNewUsername({ text: e.target.value, isPending: false })}
						placeholder="New username..."
					/>
				) : (
					<div className="data">{user.username}</div>
				)}
			</div>
			{/* <div className="email">
				<div className="top">
					<H2>Email</H2>
					{edit.isOpen && edit.type === "email" ? (
						<div className="buttons">
							<SecondaryBtn
								isLoading={newEmail.isPending}
								disabled={newEmail.isPending}
								onClick={() => setEdit({ isOpen: false, type: "none" })}>
								Cancel
							</SecondaryBtn>
							<PrimaryBtn
								isLoading={newEmail.isPending}
								disabled={newEmail.isPending}
								onClick={handleSubmitEmail}>
								Submit
							</PrimaryBtn>
						</div>
					) : (
						<SecondaryBtn size="medium" onClick={() => setEdit({ isOpen: true, type: "email" })}>
							Change
						</SecondaryBtn>
					)}
				</div>
				{edit.isOpen && edit.type === "email" ? (
					<Input
						disabled={newEmail.isPending}
						value={newEmail.text}
						onChange={e => setNewEmail({ text: e.target.value, isPending: false })}
						placeholder="New email..."
					/>
				) : (
					<div className="data">{user.email}</div>
				)}
			</div> */}
			<div className="password">
				<div className="top">
					<H2>Password</H2>
					<SecondaryBtn size="medium" onClick={() => showModal("CHANGE_PASSWORD", null)}>
						Change
					</SecondaryBtn>
				</div>
				<div className="data">********</div>
			</div>
		</Container>
	)
}

const Container = styled.div`
	.top {
		display: flex;
		justify-content: space-between;
		margin-top: 40px;
	}
	.data {
		border-radius: 4px;
		padding: 10px;
		margin: 10px 0;
		color: ${({ theme }) => theme.text};
		background: ${({ theme }) => theme.commentBg};
	}
	.buttons {
		display: flex;
		align-items: center;
		button {
			margin-left: 10px;
		}
	}
`
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
