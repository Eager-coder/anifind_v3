import styled from "styled-components"

const FooterEl = styled.footer`
	background-color: #32343b;
	/* position: absolute; */
	/* bottom: 0; */
	/* left: 0; */
	/* right: 0; */
	.footer-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 10px 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.logo {
			color: rgb(255, 255, 255);
			font-size: 2rem;
			font-weight: 600;
			width: 230px;
			filter: invert(0.2);
			&::after {
				content: "Find";
				color: #70c7a7;
			}
		}
		span {
			color: #eeeeee;
			font-size: 0.85rem;
			small {
				color: rgb(207, 83, 83);
			}
		}
		p {
			color: #eeeeee;
			font-size: 0.85rem;
			width: 230px;
		}
	}

	@media screen and (max-width: 768px) {
		.footer-container {
			padding: 10px 0;
			flex-direction: column;
			.logo,
			p {
				width: max-content;
				margin: 10px 0;
			}
		}
	}

	@media screen and (max-width: 480px) {
		.footer-container {
			.logo {
				font-size: 2rem;
				margin: 5px 0;
			}
			p {
				margin: 5px 0;
			}
			span,
			p {
				font-size: 0.9rem;
				font-weight: 400;
			}
		}
	}
`
export default function Footer() {
	return (
		<FooterEl>
			<div className="footer-container">
				<div className="logo">Ani</div>
				<span>
					Created with <small>❤</small> by Sultan
				</span>
				<p>
					Email:
					<a href="mailto:turan.sultann@gmail.com">turan.sultann@gmail.com</a>
				</p>
			</div>
		</FooterEl>
	)
}
