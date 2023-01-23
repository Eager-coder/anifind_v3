import { useContext } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { FC } from "react"
import { RouteChildrenProps } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import styled from "styled-components"
import LoadingSpinner from "../../components/general/LoadingSpinner"
import { PrimaryBtn } from "../../components/styles/ButtonStyles"
import { H1, H2 } from "../../components/styles/Styles"
import { AppContext } from "../../context/AppContext"
interface Props {
	match: {
		params: {
			token: string
		}
	}
	history: RouteChildrenProps["history"]
}
const EmailVerificationPage: FC<Props> = ({ match, history }) => {
	const { client } = useContext(AppContext)
	const [isLoading, setIsLoading] = useState(true)
	const [hasVerified, setHasVerified] = useState(false)
	const verifyEmail = async () => {
		const { ok } = await client(`/auth/verify/${match.params.token}`, {
			shouldShowMessage: "default",
		})
		setIsLoading(false)
		setHasVerified(ok)
	}
	useEffect(() => {
		verifyEmail()
	}, [])
	return (
		<PageStyled>
			<div className="container">
				<H1>Verify email</H1>
				{isLoading ? (
					<LoadingSpinner size={70} />
				) : (
					<>
						{hasVerified ? (
							<div className="success">
								<img src="/assets/icons/email.svg" alt="" />
								<h2>Success! Your email has been verified!</h2>
								<PrimaryBtn onClick={() => history.push("/login")}>Login</PrimaryBtn>
							</div>
						) : (
							<div className="error">
								<img src="/assets/icons/cancel.svg" alt="" />
								<h2>Oops! Someting went wrong</h2>
								<p>Seems like the link has expired or your account has already been verified.</p>
								<PrimaryBtn onClick={() => history.push("/resend-verification")}>Resend link</PrimaryBtn>
							</div>
						)}
					</>
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
			padding: 50px;
			margin-top: 50px;
			max-width: 100%;
		}
		h1 {
			text-align: center;
			margin-bottom: 30px;
		}
		img {
			width: 100px;
			height: auto;
			margin-bottom: 30px;
			@media (max-width: 480px) {
				width: 70px;
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
			p {
				margin-bottom: 30px;
			}
		}
	}
`

export default EmailVerificationPage
