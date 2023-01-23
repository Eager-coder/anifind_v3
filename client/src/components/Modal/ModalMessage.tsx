import { createRef, FC, RefObject, useContext, useEffect } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { AppContext } from "../../context/AppContext"

const ModalMessage: FC = () => {
	const { modalMessage, showModalMessage, hideModalMessage } = useContext(AppContext)
	const { text, isSuccess } = modalMessage
	const ref = createRef<HTMLDivElement>()

	useEffect(() => {
		if (text) {
			const close = setTimeout(() => {
				hideModalMessage()
			}, 3000)
			return () => clearTimeout(close)
		}
	}, [text])

	return createPortal(
		<CSSTransition
			nodeRef={ref}
			in={text ? true : false}
			timeout={200}
			classNames="message"
			unmountOnExit>
			<Container isSuccess={isSuccess} ref={ref}>
				<p>{text}</p>
				<span onClick={hideModalMessage}>&#10006;</span>
			</Container>
		</CSSTransition>,
		document.querySelector("#root")!
	)
}
export default ModalMessage

const Container = styled.div<{ isSuccess: boolean }>`
	position: fixed;
	top: 0px;
	left: 50%;
	transform: translate(-50%, 50px);
	background: ${({ isSuccess }) => (isSuccess ? "#c3f1c7" : "#e4c4c4")};
	padding: 10px;
	border-radius: 4px;
	height: max-content;
	width: 400px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 2;
	p {
		color: ${({ isSuccess }) => (isSuccess ? "#00915c" : "#C2185B")};
		margin-right: 10px;
	}
	span {
		font-size: 1.2rem;
		cursor: pointer;
		color: #303030;
	}
	&.message-enter {
		transform: translate(-50%, 0px);
		transition: 200ms;
		opacity: 0;
	}
	&.message-enter-active {
		transform: translate(-50%, 50px);
		transition: 200ms;
		opacity: 1;
	}
	&.message-exit {
		transform: translate(-50%, 50px);
		transition: 200ms;
	}
	&.message-exit-active {
		transform: translate(-50%, 0px);
		transition: 200ms;
		opacity: 0;
	}
	@media (max-width: 480px) {
		width: calc(100% - 40px);
		p {
			font-size: 0.9rem;
		}
	}
`
