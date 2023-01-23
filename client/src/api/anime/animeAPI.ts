const animeQuery = async (id: number) => {
	const query = `
    query ($id: Int) {
      Media(id: $id) {
        id
        title {
          romaji
          english
          native
        }
        description
        trailer {
          id
        }
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        episodes
        status
        duration
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        season
        seasonYear
        studios(isMain: true) {
          edges {
            id
            node {
              name
            }
          }
        }
        genres
        characters(sort: [ROLE, ID], role: MAIN) {
          edges {
            id
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
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
				query,
				variables: { id },
			}),
		}
	const res = await fetch(url, options)
	const json = await res.json()
	return json.data.Media
}
export default animeQuery
