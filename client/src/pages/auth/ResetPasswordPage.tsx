import { useContext } from "react"
import { useState } from "react"
import { FC, FormEvent } from "react"
import { RouteComponentProps } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn } from "../../components/styles/ButtonStyles"
import { AppContext } from "../../context/AppContext"
import getUrlObj from "../../utlis/getUrlObj"

interface Props {
	match: {
		params: {
			id: string
			token: string
		}
	}
	history: RouteComponentProps["history"]
}
const ResetPasswordPage: FC<Props> = ({ match, history }) => {
	const [password, setPassword] = useState("")
	const [password2, setPassword2] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const { id, token } = getUrlObj(history.location.search)
	if (!id || !token) {
		history.replace("/404")
	}
	const { client, showModalMessage } = useContext(AppContext)
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		if (password !== password2) {
			showModalMessage("Passwords must match", false)
		}
		const { ok } = await client("/auth/reset-password", {
			method: "POST",
			body: { new_password: password, id, token },
			shouldShowMessage: "default",
		})
		if (ok) {
			history.push("/login")
		}
		setIsLoading(false)
	}
	return (
		<PageStyled>
			<div className="container">
				<h1>Reset password</h1>
				<form onSubmit={handleSubmit}>
					<input
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="New password"
						type="password"
						name="password"
					/>
					<input
						value={password2}
						onChange={e => setPassword2(e.target.value)}
						placeholder="Confirm new password"
						type="password"
						name="password2"
					/>
					<PrimaryBtn>Reset</PrimaryBtn>
				</form>
			</div>
		</PageStyled>
	)
}
const PageStyled = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	@media (max-width: 480px) {
		padding: 0;
		margin: 0;
	}
	.container {
		max-width: 400px;
		margin: auto;
		margin-top: 50px;
		padding: 50px;
		background: ${({ theme }) => theme.commentBg};
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		align-items: center;
		@media (max-width: 480px) {
			padding: 40px 20px;
			margin-top: 50px;
			max-width: 100%;
		}
		form {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		h1 {
			text-align: center;
			margin-bottom: 30px;
			@media (max-width: 768px) {
				font-size: 1.7rem;
			}
			@media (max-width: 480px) {
				font-size: 1.4rem;
			}
		}
		img {
			width: 80px;
			height: auto;
			margin-bottom: 30px;
			@media (max-width: 480px) {
				width: 60px;
			}
		}
		input {
			width: 100%;
			height: 35px;
			font-size: 1rem;
			border-radius: 4px;
			padding: 5px 10px;
			border: none;
			background: #edf1f5;

			&[name="password"] {
				margin-bottom: 20px;
			}
			&[name="password2"] {
				margin-bottom: 50px;
			}
		}
		.success,
		.error {
			display: flex;
			flex-direction: column;
			align-items: center;
			h2 {
				font-size: 1.2rem;
				text-align: center;
				margin-bottom: 30px;
			}
			.link-container {
				margin-top: 30px;

				span {
					color: ${({ theme }) => theme.text};
					font-size: 0.9rem;
				}
			}
		}
	}
`
export default ResetPasswordPage
