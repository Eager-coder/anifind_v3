import { createContext, FC, useState } from "react"
import customFetch, { Method, ClientType } from "../utlis/client"

type ModalType =
	| "CHANGE_PASSWORD"
	| "OPEN_THREAD"
	| "DEFAULT"
	| "DELETE_THREAD"
	| "DELETE_POST"
	| "DELETE_COMMENT"
type showModal = (type: ModalType, props: any) => void

type hideModal = () => void

type showModalMessage = (text: string, isSuccess: boolean) => void

type hideModalMessage = () => void

type Client = (
	url: string,
	options?: {
		method?: Method
		body?: object
		shouldShowMessage?: "default" | "error" | "none"
	}
) => Promise<ClientType>

type modal = {
	isOpen: boolean
	type: ModalType
	props?: any
}
type modalMessage = {
	text: string
	isSuccess: boolean
}
type ContextTypes = {
	modal: modal
	modalMessage: modalMessage
	showModal: showModal
	hideModal: hideModal
	showModalMessage: showModalMessage
	hideModalMessage: hideModalMessage
	client: Client
}
const initialState: ContextTypes = {
	modal: { isOpen: false, type: "DEFAULT", props: null },
	modalMessage: { text: "", isSuccess: false },
	showModal: () => {},
	hideModal: () => {},
	showModalMessage: () => {},
	hideModalMessage: () => {},
	client: () => new Promise(() => ({ ok: false, status: 200, data: null, message: "" })),
}
export const AppContext = createContext<ContextTypes>(initialState)

export const AppProvider: FC = ({ children }) => {
	const [modal, setModal] = useState<modal>(initialState.modal)
	const [modalMessage, setModalMessage] = useState<modalMessage>(initialState.modalMessage)

	const showModal: showModal = (type, props) => {
		setModal({ isOpen: true, type, props: props })
	}
	const hideModal: hideModal = () => {
		setModal({ isOpen: false, type: "DEFAULT", props: {} })
	}
	const showModalMessage: showModalMessage = (text, isSuccess) => {
		setModalMessage({ text, isSuccess })
	}
	const hideModalMessage: hideModalMessage = () => {
		setModalMessage({ text: "", isSuccess: false })
	}

	const client: Client = async (url, { method = "GET", body, shouldShowMessage = false } = {}) => {
		const res = await customFetch(url, method, body)
		if (shouldShowMessage === "default") {
			showModalMessage(res.message, res.ok)
		}
		if (shouldShowMessage === "error" && !res.ok) {
			showModalMessage(res.message, res.ok)
		}
		return res
	}

	const value = {
		modal,
		modalMessage,
		showModal,
		hideModal,
		showModalMessage,
		hideModalMessage,
		client,
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
