import { useState, useEffect, memo, FC } from "react"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import searchAPI from "../api/anime/searchAPI"
import SearchSection from "../components/Search/SearchSection"
import InfiniteScroll from "react-infinite-scroll-component"
import EmptyState from "../components/Search/EmptyState"
import { Card, CardType, SkeletonCard } from "../components/Search/Card"
import getUrlObj from "../utlis/getUrlObj"
const array = new Array(18)

const SearchPage: FC = () => {
	const [result, setResult] = useState<CardType[]>([])
	const [hasNoResult, setHasNoResult] = useState(false)
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(true)
	const [hasNextPage, sethasNextPage] = useState(true)
	const location = useLocation()

	const getData = async () => {
		setLoading(true)
		const urlParams = new URLSearchParams(location.search)
		const entries = urlParams.entries()
		const newParams = Object.fromEntries(entries)
		const data = await searchAPI({ ...newParams, page })
		if (!data.media.length) return setHasNoResult(true)
		setHasNoResult(false)
		sethasNextPage(data.pageInfo.hasNextPage)
		setResult(prevResult => [...prevResult, ...data.media])
		setLoading(false)
	}
	useEffect(() => {
		const { genre, query, format, season, year } = getUrlObj(location.search)
		if (genre || query || format || season || year) {
			setHasNoResult(false)
			setPage(1)
			setResult([])
			getData()
		} else {
			setHasNoResult(true)
		}
	}, [location])

	useEffect(() => {
		if (page > 1) {
			getData()
		}
	}, [page])

	const SearchResults = () => {
		return (
			<>
				{loading && !result.length
					? array.map(num => <SkeletonCard item={num} key={num} />)
					: result.map(item => <Card item={item} key={item.id} />)}
			</>
		)
	}
	return (
		<SearchPageStyle>
			<SearchSection />
			{!hasNoResult ? (
				<InfiniteScroll
					className="grid"
					dataLength={result.length}
					next={() => setPage(prev => prev + 1)}
					pullDownToRefreshThreshold={50}
					hasMore={hasNextPage}
					loader={[1, 2, 3, 4, 5, 6].map(num => (
						<SkeletonCard item={num} key={num} />
					))}>
					<SearchResults />
				</InfiniteScroll>
			) : (
				<EmptyState />
			)}
		</SearchPageStyle>
	)
}
export default SearchPage
const SearchPageStyle = styled.div`
	.grid {
		margin: 0 auto;
		max-width: 1200px;
		padding: 0 50px;
		display: grid;
		/* grid-template-columns: repeat(auto-fit, minmax(100px, 180px)); */
		grid-template-columns: repeat(5, 1fr);
		/* grid-template-columns: masonry; */
		column-gap: 30px;
		row-gap: 30px;
	}
	@media (max-width: 950px) {
		.grid {
			grid-template-columns: repeat(4, auto);
		}
	}
	@media (max-width: 768px) {
		.grid {
			padding: 0 20px;
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, auto);
		}
	}
	@media (max-width: 560px) {
		.grid {
			grid-template-columns: repeat(2, auto);
		}
	}
`
