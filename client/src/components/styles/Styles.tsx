import styled from "styled-components"

export const H1 = styled.h1<{ customStyle?: string }>`
	width: 100%;
	font-size: 2.8rem;
	@media (max-width: 1024px) {
		font-size: 2.5rem;
	}
	@media (max-width: 768px) {
		font-size: 2rem;
	}
	@media (max-width: 480px) {
		font-size: 1.7rem;
	}
	${({ customStyle }) => customStyle}
`

export const H2 = styled.h2`
	font-size: 2rem;
	@media (max-width: 768px) {
		font-size: 1.7rem;
	}
	@media (max-width: 480px) {
		font-size: 1.5rem;
	}
`
