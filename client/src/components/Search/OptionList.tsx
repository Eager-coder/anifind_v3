import React, { useRef, useState, useEffect, FC, ChangeEvent } from "react"
import styled from "styled-components"
import getUrlObj from "../../utlis/getUrlObj"
import { RouteComponentProps } from "react-router-dom"
import { ListType, selectLists, selectListsType } from "./SelectList"
const List = styled.div<{ isOpen: boolean }>`
	width: unset;
	height: max-content;
	position: relative;
	.selected {
		cursor: pointer;
		width: 150px;
		height: 30px;
		background-color: white;
		border-radius: 7px;
		box-shadow: ${({ theme }) => theme.boxShadow};

		margin-bottom: 10px;
		padding: 0 15px;
		display: flex;
		justify-content: space-between;
		position: relative;
		.mask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 2;
		}
		span {
			font-size: 0.9rem;
			color: #979797;
			padding: 8px 0;
		}
		img {
			width: 15px;
			height: 15px;
			filter: invert(0.7);
			margin: 8px 0;
		}
		.cover {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
		}
	}
	.box {
		list-style: none;
		width: 150px;
		height: max-content;
		max-height: 300px;
		padding: 10px;
		overflow-y: auto;
		background-color: white;
		border-radius: 7px;
		box-shadow: ${({ theme }) => theme.boxShadow};
		position: absolute;
		display: ${({ isOpen }) => (isOpen ? "block" : "none")};
		z-index: 2;
		::-webkit-scrollbar-track {
			background-color: ${({ theme }) => theme.scrollbar};
		}
		::-webkit-scrollbar {
			border-radius: 4px;
			width: 5px;
			background-color: #f5f5f5;
		}
		::-webkit-scrollbar-thumb {
			background-color: #7e7e7e;
			border-radius: 4px;
		}
		li.option {
			cursor: pointer;
			font-size: 0.9rem;
			color: rgb(63, 63, 63);
			padding: 5px;
			border-radius: 4px;
			transition: 0.2s;
			&:hover {
				background-color: #e0e0e0;
				color: #43b375;
			}
		}
	}
	@media (max-width: 768px) {
		&:nth-child(2n) {
			justify-self: end;
		}
	}
	@media (max-width: 480px) {
		.selected,
		.box {
			width: 120px;
		}
	}
`

type Props = {
	item: selectListsType
	location: RouteComponentProps["location"]
	history: RouteComponentProps["history"]
}

const OptionList: FC<Props> = ({ item, location, history }) => {
	const [isOpen, setIsOpen] = useState(false)
	const listEl = useRef<HTMLDivElement>(null)
	const ul = useRef<HTMLUListElement>(null)

	useEffect(() => {
		window.addEventListener("click", closeList)
		return () => window.removeEventListener("click", closeList)
	}, [listEl])

	const closeList = (e: any) => {
		if (e.target !== listEl.current) setIsOpen(false)
	}

	const filterByOption = (option: ListType) => {
		const params = { ...getUrlObj(location.search), [option.type]: option.id.toString() }
		const url = new URLSearchParams(params).toString()
		history.push("/search?" + url)
	}
	return (
		<List className="list-container" isOpen={isOpen}>
			<div className="selected">
				<div ref={listEl} className="mask" onClick={() => setIsOpen(!isOpen)}></div>
				<span>{item.type}</span>
				<img src="https://img.icons8.com/ios-glyphs/30/000000/chevron-down.png" alt="" />
			</div>
			<ul ref={ul} className="box">
				{item.list.map(option => (
					<li key={option.name} className="option" onClick={() => filterByOption(option)}>
						{option.name}
					</li>
				))}
			</ul>
		</List>
	)
}
export default OptionList
