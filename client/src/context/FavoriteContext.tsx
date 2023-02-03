import { createContext, FC, useEffect, useState } from "react"
// export type AnimeType = {
// 	anime_id: number
// 	title: string
// 	cover_image: string
// }
// export type CharacterType = {
// 	character_id: number
// 	name: string
// 	cover_image: string
// }

// type setLoading = (isLoading: boolean) => void

// type fetchFav = () => Promise<void>
// type ContextTypes = {
// 	favAnime: {
// 		isLoading: boolean
// 		list: AnimeType[]
// 	}
// 	favCharacters: { isLoading: boolean; list: CharacterType[] }
// 	fetchFavAnime: fetchFav
// 	fetchFavCharacters: fetchFav
// 	loadingFavAnime: setLoading
// 	loadingFavCharacters: setLoading
// }

// const initialState = {
// 	favAnime: {
// 		isLoading: true,
// 		list: [],
// 	},
// 	favCharacters: { isLoading: true, list: [] },
// 	fetchFavAnime: async () => {},
// 	fetchFavCharacters: async () => {},
// 	loadingFavAnime: () => {},
// 	loadingFavCharacters: () => {},
// }
// export const FavoriteContext = createContext<ContextTypes>(initialState)

// export const FavoriteProvider: FC = ({ children }) => {
// 	const [anime, setAnime] = useState(initialState.favAnime)
// 	const [characters, setCharacters] = useState(initialState.favCharacters)
// 	const loadingFavAnime: setLoading = isLoading => {
// 		setAnime(prev => ({ ...prev, isLoading }))
// 	}

// 	const loadingFavCharacters: setLoading = isLoading => {
// 		setCharacters(prev => ({ ...prev, isLoading }))
// 	}

// 	const fetchFavAnime: fetchFav = async () => {
// 		const { data, ok } = await client("/user/favorite_animes")
// 		if (ok) {
// 			setAnime({ isLoading: false, list: data })
// 		}
// 	}

// 	const fetchFavCharacters: fetchFav = async () => {
// 		const { data, ok } = await client("/user/favorite_characters")
// 		if (ok) {
// 			setCharacters({ isLoading: false, list: data })
// 		}
// 	}
// 	const value = {
// 		favAnime: anime,
// 		favCharacters: characters,
// 		fetchFavAnime,
// 		fetchFavCharacters,
// 		loadingFavAnime,
// 		loadingFavCharacters,
// 	}
// 	return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>
// }
