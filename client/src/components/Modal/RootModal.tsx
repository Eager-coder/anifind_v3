import { FC, useContext } from "react"
import ReactDom from "react-dom"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import {
	// ChangeEmailModal,
	ChangePasswordModal,
	// ChangeUsernameModal,
	OpenThreadModal,
	DeleteThreadModal,
	DeletePostModal,
	DeleteCommentModal,
	// DeletePostModal,
} from "./Modals"

const MODAL_COMPONENTS = {
	// CHANGE_USERNAME: ChangeUsernameModal,
	// CHANGE_EMAIL: ChangeEmailModal,
	CHANGE_PASSWORD: ChangePasswordModal,
	OPEN_THREAD: OpenThreadModal,
	DEFAULT: () => null,
	DELETE_THREAD: DeleteThreadModal,
	DELETE_POST: DeletePostModal,
	DELETE_COMMENT: DeleteCommentModal,
}
export default function RootModal() {
	const { isOpen, type } = useContext(AppContext).modal
	if (!isOpen) return null
	const CurrentModal: FC = MODAL_COMPONENTS[type] || null

	return ReactDom.createPortal(
		<ModalContainer>
			<div className="container">
				<div className="content">
					<CurrentModal />
				</div>
			</div>
		</ModalContainer>,
		document.querySelector(".App")!
	)
}

const ModalContainer = styled.div`
	position: fixed;
	background: rgba(0, 0, 0, 0.5);
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	.container {
		width: max-content;
		background: ${({ theme }) => theme.body};
		padding: 25px;
		border-radius: 4px;
		h2,
		p {
			margin-bottom: 10px;
		}
	}
	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	@media (max-width: 768px) {
		.container {
			width: calc(100% - 40px);
			textarea {
				width: 100%;
				font-size: 0.95rem;
			}
			input {
				width: 100%;
			}
		}
	}
`
