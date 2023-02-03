import { useContext } from "react"
import { FormEvent, useState } from "react"
import styled from "styled-components"
import { PrimaryBtn } from "../../components/styles/ButtonStyles"
import { H1 } from "../../components/styles/Styles"
import { AppContext } from "../../context/AppContext"

const RequestPasswordResetPage = () => {
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [status, setStatus] = useState({ hasSent: false, isSuccess: false })
	const { client } = useContext(AppContext)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		const { ok } = await client("/auth/request-password-reset", { method: "POST", body: { email } })
		setIsLoading(false)

		setStatus({ hasSent: true, isSuccess: ok })
	}
	return (
		<PageStyled>
			<div className="container">
				<h1>Request password reset</h1>
				{status.hasSent ? (
					<>
						{status.isSuccess ? (
							<>
								<img src="/assets/icons/checked.svg" alt="" />
								<p>Password reset link has been sent. Check your inbox.</p>
							</>
						) : (
							<>
								<img src="/assets/icons/cancel.svg" alt="" />
								<p>Oops! Something went wrong!</p>
							</>
						)}
					</>
				) : (
					<form onSubmit={handleSubmit}>
						<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" />
						<PrimaryBtn disabled={isLoading}>Send link</PrimaryBtn>
					</form>
				)}
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
			margin-bottom: 50px;
			height: 35px;
			font-size: 1rem;
			border-radius: 4px;
			padding: 5px 10px;
			border: none;
			background: #edf1f5;
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

export default RequestPasswordResetPage
