import React from "react"
import { render } from "react-dom"
import App from "./App"
import { AppProvider } from "./context/AppContext"
import { UserProvider } from "./context/UserContext"

render(
	<React.StrictMode>
		<AppProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</AppProvider>
	</React.StrictMode>,
	document.getElementById("root"),
)
