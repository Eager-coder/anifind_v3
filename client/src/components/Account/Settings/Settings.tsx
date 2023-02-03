import styled from "styled-components"
import { H1 } from "../../styles/Styles"
import Avatar from "./Avatar"
import Credentials from "./Credentials"

export default function Settings() {
	return (
		<SettingsContainer>
			<H1>Settings</H1>
			<div>
				<Avatar />
				<Credentials />
			</div>
		</SettingsContainer>
	)
}

const SettingsContainer = styled.div`
	width: 100%;
`
