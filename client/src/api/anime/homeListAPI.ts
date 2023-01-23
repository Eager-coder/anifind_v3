const homeListQuery = async () => {
	const query = `
  query popular {
    trending: Page (page: 1) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(sort: TRENDING_DESC type: ANIME) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          extraLarge
          color
        }
      }
    }
    top: Page (page: 1) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(sort: POPULARITY_DESC type: ANIME) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
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
			body: JSON.stringify({ query }),
		}
	try {
		const res = await fetch(url, options)
		const { data } = await res.json()
		return data
	} catch (error) {
		console.log(error)
	}
}

export default homeListQuery
