import { useEffect, useState, memo, useContext } from "react"
import Navbar from "./components/general/Navbar"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import Home from "./pages/HomePage"
import Login from "./pages/auth/LoginPage"
import AnimePage from "./pages/AnimePage"
import Register from "./pages/auth/RegisterPage"
import User from "./pages/AccountPage"
import { lightTheme, darkTheme, Theme } from "./utlis/constants"
import Footer from "./components/general/Footer"
import ModalMessage from "./components/Modal/ModalMessage"
import RootModal from "./components/Modal/RootModal"
import Character from "./pages/CharacterPage"
import DiscussionsListPage from "./pages/discussion/DiscussionsListPage"
import DiscussionPage from "./pages/discussion/DiscussionPage"
import NotFound from "./pages/NotFound"
import { UserContext } from "./context/UserContext"
import MemberPage from "./pages/MemberPage"
import SearchPage from "./pages/SearchPage"
import EmailVerificationPage from "./pages/auth/EmailVerificationPage"
import ResendVerificationPage from "./pages/auth/ResendVerificationPage"
import RequestPasswordResetPage from "./pages/auth/RequestResetPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import io from "socket.io-client"
import "./index.css"

const socket = io("http://localhost", { withCredentials: true, autoConnect: false })

const App = () => {
	const [theme, setTheme] = useState<Theme>(lightTheme)
	const { user, setUser } = useContext(UserContext)
	useEffect(() => {
		setUser()

		const userTheme = localStorage.getItem("theme")
		setTheme(userTheme === "dark" ? darkTheme : lightTheme)
	}, [])

	const switchTheme = (themeType: string) => {
		setTheme(themeType === "dark" ? darkTheme : lightTheme)
		localStorage.setItem("theme", themeType)
	}
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<GlobalStyle />
				<div className="App">
					<Navbar theme={theme.theme} switchTheme={switchTheme} />
					<main>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/anime/:id" component={AnimePage} />
							<Route exact path="/character/:id" component={Character} />
							<Route exact path="/user/:username" component={MemberPage} />
							<Route exact path="/search" component={SearchPage} />
							{/* <Route exact path="/messages" component={() => <MessagesPage socket={socket} />} /> */}
							<Route exact path="/me/:category" component={() => <User socket={socket} />} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Register} />
							<Route exact path="/verify-email/:token" component={EmailVerificationPage} />
							<Route exact path="/resend-verification" component={ResendVerificationPage} />
							<Route exact path="/request-password-reset" component={RequestPasswordResetPage} />
							<Route exact path="/reset-password" component={ResetPasswordPage} />
							<Route exact path="/discussions" component={DiscussionsListPage} />
							<Route exact path="/discussions/threads/:thread_id" component={DiscussionPage} />
							<Route exact path="/404" component={NotFound} />
							<Route path="*" component={NotFound} />
						</Switch>
					</main>
					<Footer />
				</div>
				<ModalMessage />
				<RootModal />
			</Router>
		</ThemeProvider>
	)
}

export default memo(App)
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
		box-sizing: border-box;
		font-family: 'Overpass', sans-serif;
	}
	body {
		background: ${({ theme }: any) => theme.body};
		transition: 0.5s;
	}

	main {
  	min-height: calc(100vh - 10rem);
	}

	a {
		text-decoration: none;
	}
	h1, h2, h3, h4 {
		color: ${({ theme }) => theme.header};
		transition: 0.5s;
	}
	p {
		color: ${({ theme }) => theme.text};
		transition: 0.5s;
	}
`
