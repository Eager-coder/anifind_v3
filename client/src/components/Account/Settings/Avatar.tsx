import { useContext, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/AppContext"
import { UserContext } from "../../../context/UserContext"
import { PrimaryBtn } from "../../styles/ButtonStyles"
import { H2 } from "../../styles/Styles"

export default function Avatar() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [fileInput, setFileInput] = useState<string>("")
	const [previewImg, setPreviewImg] = useState<any>(null)
	const [b64Img, setB64Img] = useState<any>(null)
	const [message, setMessage] = useState("")
	const { avatar_url } = useContext(UserContext).user
	const { showModalMessage, client } = useContext(AppContext)
	const { setUser } = useContext(UserContext)
	const handleFileInput = (e: any) => {
		if (!e.target.files[0]) return
		const file = e.target.files[0]
		if (file.size / 1024 > 1500) {
			setFileInput("")
			return showModalMessage("Image size must not exceed 1.5MB", false)
		}
		setMessage("")
		setFileInput(e.target.value)
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			setB64Img(reader.result)
			setPreviewImg(reader.result)
		}
		reader.onerror = () => {
			showModalMessage("Something went wrong", false)
		}
	}

	const handleSubmit = async () => {
		setMessage("Loading...")
		setFileInput("")
		if (!b64Img) return showModalMessage("Please select an image", false)
		const { ok } = await client("/profile/avatar", {
			method: "PUT",
			body: { avatar: b64Img },
			shouldShowMessage: "default",
		})
		setMessage("")
		if (ok) {
			setUser()
		}
	}
	return (
		<Container>
			<H2>Avatar</H2>
			<div className="avatar">
				<InputSquare className="image" onClick={() => inputRef?.current?.click()}>
					<div className="line">
						<p>{message ? message : "Click to choose an image"}</p>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							defaultValue={fileInput}
							onChange={handleFileInput}
						/>
					</div>
				</InputSquare>
				{previewImg ? (
					<img className="image" src={previewImg} />
				) : (
					<img className="image" src={avatar_url} alt="" />
				)}
			</div>
			<PrimaryBtn disabled={!fileInput} onClick={handleSubmit}>
				Save
			</PrimaryBtn>
		</Container>
	)
}
const Container = styled.div`
	.avatar {
		display: flex;
		margin-bottom: 20px;
	}
	img {
		object-fit: cover;
		margin-left: 20px;
		border-radius: 4px;
	}
	.image {
		width: 250px;
		height: 250px;
	}
	@media (max-width: 1024px) {
		.image {
			width: 200px;
			height: 200px;
		}
	}
	@media (max-width: 480px) {
		.image {
			width: 130px;
			height: 130px;
		}
	}
`
const InputSquare = styled.div`
	cursor: pointer;
	border-radius: 4px;
	background: ${({ theme }) => theme.commentBg};
	padding: 20px;
	.line {
		width: 100%;
		height: 100%;
		border: 2px gray dashed;
		display: flex;
		justify-content: center;
		align-items: center;
		input {
			display: none;
		}
		p {
			text-align: center;
		}
	}
	@media (max-width: 480px) {
		padding: 10px;

		.line {
			p {
				font-size: 0.9rem;
			}
		}
	}
`
