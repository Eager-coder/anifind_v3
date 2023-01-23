import { useState, memo, useContext, FC, ChangeEvent, FormEvent } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn, SecondaryBtn } from "../../components/styles/ButtonStyles"
import { ClipLoader } from "react-spinners"
import { UserContext } from "../../context/UserContext"
import { AppContext } from "../../context/AppContext"
import { H1 } from "../../components/styles/Styles"
import { base_url } from "../../utlis/client"

const Login: FC = () => {
	const [form, setForm] = useState({ email: null, password: null })
	const history = useHistory()
	const { showModalMessage } = useContext(AppContext)
	const { user, loadingUser, setUser } = useContext(UserContext)
	const { isLoading } = user
	const [isNotVerified, setIsNotVerified] = useState(false)
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		loadingUser(true)
		const res = await fetch(base_url + "/auth/login", {
			method: "POST",
			body: JSON.stringify(form),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
		const { data, message } = await res.json()
		loadingUser(false)

		if (res.ok) {
			setUser().then(() => history.replace("/"))
		} else if (res.status === 401) {
			setIsNotVerified(true)
		} else {
			showModalMessage(message, res.ok)
		}
	}
	return (
		<LoginEl>
			<div className="form-container">
				<H1>Log in</H1>
				{isNotVerified ? (
					<div className="not-verified">
						<h2> Email is not verified</h2>
						<p>Check your inbox and look for a link to verify your account.</p>
						<div>
							<span>Haven't received a link? </span>
							<SecondaryBtn size="small" onClick={() => history.push("/resend-verification")}>
								Resend link
							</SecondaryBtn>
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<input
							name="email"
							type="email"
							onChange={handleChange}
							placeholder="Email"
							required
							autoComplete="email"
						/>
						<input
							name="password"
							type="password"
							onChange={handleChange}
							placeholder="Password"
							required
							autoComplete="password"
						/>
						<SecondaryBtn
							size="small"
							type="button"
							className="forgot-password"
							onClick={() => history.push("/request-password-reset")}>
							Forgot password
						</SecondaryBtn>

						<PrimaryBtn type="submit" className="submit" disabled={isLoading} isLoading={isLoading}>
							{isLoading ? <ClipLoader color="#fff" size="25" /> : "Log in"}
						</PrimaryBtn>
						<p>
							Don't have an accound? <Link to="/register">Sign up</Link>
						</p>
					</form>
				)}
			</div>
		</LoginEl>
	)
}

export default memo(Login)

const LoginEl = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	.form-container {
		max-width: 400px;
		margin: auto;
		margin-top: 50px;
		padding: 50px;
		background: ${({ theme }) => theme.commentBg};
		border-radius: 4px;

		h1 {
			text-align: center;
			margin-bottom: 50px;
		}

		form {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			input {
				width: 100%;
				margin: 10px 0;
				height: 35px;
				font-size: 1rem;
				border-radius: 4px;
				padding: 5px 10px;
				border: none;
				background: #edf1f5;
			}
			p {
				margin-top: 50px;
				a {
					color: #70c7a7;
				}
			}
			button.forgot-password {
				margin-top: 10px;
			}
			button.submit {
				margin-top: 30px;
			}
		}
	}
	.not-verified {
		h2 {
			text-align: center;
			margin-bottom: 10px;
			@media (max-width: 480px) {
				font-size: 1.2rem;
			}
		}
		div {
			margin-top: 30px;
			span {
				color: ${({ theme }) => theme.text};
				font-size: 0.8rem;
			}
		}
	}
	@media (max-width: 768px) {
		padding: 0;
		margin: 0;
		.form-container {
			padding: 50px;
			margin: 0;
			max-width: 100%;
			height: 80vh;
		}
	}
	@media (max-width: 480px) {
		.form-container {
			padding: 50px 20px;
			margin: 0;
			max-width: 100%;
			height: 80vh;
		}
	}
`
