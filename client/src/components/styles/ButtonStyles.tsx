import { FC } from "react"
import styled from "styled-components"
import BeatLoader from "react-spinners/BeatLoader"
type Size = "small" | "medium" | "large"
interface ButtonStyleType {
	size: Size
	disabled: boolean
	color: string
	customStyle?: string
}
const PrimaryButtonStyle = styled.button<ButtonStyleType>`
	font-family: "Overpass", sans-serif;
	cursor: pointer;
	background: ${({ color }) => color};
	border-radius: 4px;
	border: none;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 500;
	transition: 0.2s;
	width: max-content;
	:hover {
		filter: brightness(0.9);
	}
	:disabled {
		filter: brightness(0.8);
		opacity: 0.7;
	}
	font-size: ${({ size }) =>
		size === "small" ? "0.9rem" : size === "medium" ? "1.1rem" : size === "large" ? "1.5rem" : "0"};
	padding: ${({ size }) =>
		size === "small"
			? "3px 8px"
			: size === "medium"
			? "5px 12px"
			: size === "large"
			? "8px 16px"
			: "0"};
	@media (max-width: 640px) {
		font-size: ${({ size }) =>
			size === "small"
				? "0.8rem"
				: size === "medium"
				? "0.95rem"
				: size === "large"
				? "1.15rem"
				: "0"};
	}
	${({ customStyle }) => customStyle}
`

interface ButtonType {
	onClick?: () => void
	className?: string
	size?: Size
	color?: "green" | "red"
	isLoading?: boolean
	disabled?: boolean
	customStyle?: string
	type?: "submit" | "reset" | "button"
}
export const PrimaryBtn: FC<ButtonType> = ({
	children,
	color = "green",
	size = "medium",
	onClick,
	className,
	disabled,
	isLoading,
	customStyle,
}) => {
	const spinnerSize = size === "small" ? 5 : size === "medium" ? 10 : size === "large" ? 15 : 0
	return (
		<PrimaryButtonStyle
			color={color === "red" ? "#F15858" : "#70c7a7"}
			disabled={disabled || false}
			size={size}
			onClick={onClick}
			className={className}
			customStyle={customStyle}>
			{isLoading ? <BeatLoader size={spinnerSize} color="white" /> : children}
		</PrimaryButtonStyle>
	)
}

const SecondaryBtnStyle = styled.button<ButtonStyleType>`
	cursor: pointer;
	color: ${({ color }) => color};
	font-weight: 500;
	font-size: ${({ size }) =>
		size === "small" ? "0.8rem" : size === "medium" ? "1rem" : size === "large" ? "1.5rem" : "0"};
	border: none;
	background: none;
	:hover {
		filter: brightness(0.9);
	}
	:disabled {
		filter: brightness(0.8);
		opacity: 0.7;
	}
	@media (max-width: 640px) {
		font-size: ${({ size }) =>
			size === "small"
				? "0.8rem"
				: size === "medium"
				? "0.95rem"
				: size === "large"
				? "1.15rem"
				: "0"};
	}
	${({ customStyle }) => customStyle}
`
export const SecondaryBtn: FC<ButtonType> = ({
	children,
	color = "green",
	size = "medium",
	onClick,
	disabled,
	className,
	customStyle,
	type,
}) => {
	return (
		<SecondaryBtnStyle
			onClick={onClick}
			disabled={disabled || false}
			size={size}
			color={color === "red" ? "#F15858" : "#70c7a7"}
			className={className}
			customStyle={customStyle}
			type={type}>
			{children}
		</SecondaryBtnStyle>
	)
}
