// const searchQuery = async (variables: { query: string, page: number }) => {
const searchQuery = async (variables: any) => {
	const query = `
		query ($id: Int, $page: Int, $perPage: Int, $search: String, 
			$genre: String, $isAdult: Boolean, $year: Int, $format: MediaFormat, $sort: [MediaSort]) 
		{
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
				media (id: $id, search: $search, genre: $genre, isAdult: $isAdult, 
					type: ANIME, seasonYear: $year, format: $format, sort: $sort) 
				{
          id
					title {
						romaji
						english
						native
						userPreferred
					} 
          coverImage {
						medium
						large
						extraLarge
						color
          }
        }
      }
    }
    `
	const url = "https://graphql.anilist.co",
		options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query: query,
				variables: {
					...variables,
					search: variables.query,
					sort: variables.query ? ["SEARCH_MATCH"] : ["POPULARITY_DESC"],
				},
			}),
		}
	try {
		const res = await fetch(url, options)
		const json = await res.json()
		return json.data.Page
	} catch (error) {
		console.log(error)
	}
}
export default searchQuery
