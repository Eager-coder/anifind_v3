import { FC, FormEvent, useContext, useState } from "react"
import { RouteChildrenProps } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn, SecondaryBtn } from "../../components/styles/ButtonStyles"
import { H1 } from "../../components/styles/Styles"
import { AppContext } from "../../context/AppContext"
interface Props {
	match: {
		params: {
			token: string
		}
	}
	history: RouteChildrenProps["history"]
}
const ResendVerificationPage: FC<Props> = ({ match, history }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [status, setStatus] = useState({ hasSent: false, isSuccess: false })
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState("")
	const { client } = useContext(AppContext)
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		const { data, message, ok } = await client("/auth/resend-verification-link", {
			method: "POST",
			body: { email },
			shouldShowMessage: "none",
		})
		message && setMessage(message)
		setIsLoading(false)
		setStatus({ hasSent: true, isSuccess: ok })
	}
	return (
		<PageStyled>
			<div className="container">
				<H1>Resend link</H1>
				{status.hasSent ? (
					<>
						{status.isSuccess ? (
							<div className="success">
								<img src="/assets/icons/checked.svg" alt="" />
								<p>Email has been sent. Check your inbox.</p>
							</div>
						) : (
							<div className="error">
								<img src="/assets/icons/cancel.svg" alt="" />
								<h2>Oops! Something went wrong. </h2>
								{message && <p>{message}</p>}
								<div className="link-container">
									<span>
										Already verified?{" "}
										<SecondaryBtn customStyle="font-size: 0.9rem;" onClick={() => history.replace("/login")}>
											Log in
										</SecondaryBtn>
									</span>
								</div>
							</div>
						)}
					</>
				) : (
					<form onSubmit={handleSubmit}>
						<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" />
						<PrimaryBtn disabled={isLoading}>Resend link</PrimaryBtn>
					</form>
				)}
			</div>
		</PageStyled>
	)
}
export default ResendVerificationPage

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
			padding: 50px;
			margin-top: 50px;
			max-width: 100%;
		}
		form {
			width: 100%;
		}
		h1 {
			text-align: center;
			margin-bottom: 30px;
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
