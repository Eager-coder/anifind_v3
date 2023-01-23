import { createContext, FC, useContext, useState } from "react"
import { AppContext } from "./AppContext"
type UserType = {
	isLoggedIn: boolean
	isLoading: boolean
	id?: string
	username?: string
	email?: string
	created_at?: number
	about?: string
	avatar_url?: string
}

type UserProps = {
	user: UserType
	loadingUser: (isLoading: boolean) => void
	setUser: () => Promise<boolean>
	changeUserData: ChangeUserData
}

type ChangeUserData = (type: "username" | "avatar_url" | "email" | "about", value: string) => void

export const UserContext = createContext<UserProps>({
	user: { isLoading: true, isLoggedIn: false },
	loadingUser: () => {},
	setUser: async () => false,
	changeUserData: () => {},
})

export const UserProvider: FC = ({ children }) => {
	const { client } = useContext(AppContext)
	const [user, setUserData] = useState<UserType>({ isLoading: true, isLoggedIn: false })
	const loadingUser = (isLoading: boolean) => {
		setUserData(prev => ({ ...prev, isLoading }))
	}
	const setUser = async (): Promise<boolean> => {
		loadingUser(true)
		const { data, ok } = await client("/profile")
		if (ok) {
			setUserData({ ...data, isLoading: false, isLoggedIn: true })
		} else {
			loadingUser(false)
		}

		return ok
	}
	const changeUserData: ChangeUserData = (type, value) => {
		setUserData(prev => ({ ...prev, [type]: value }))
	}
	return <UserContext.Provider value={{ user, loadingUser, setUser, changeUserData }}>{children}</UserContext.Provider>
}
