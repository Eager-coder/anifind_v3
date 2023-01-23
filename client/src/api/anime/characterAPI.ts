const query = `
query($id: Int){
  Character(id: $id) {
    id
    name {
      first
      last
      full
      native
      alternative
    }
    description
    image {
      large
    }
		 media(type: ANIME) {
      edges {
        node {
					id
          type
          title {
            romaji
            english
            native
            userPreferred
          }
					 coverImage {
            extraLarge
            large
            medium
            color
          }
        }
      }
    }
  }
}
`
const characterQuery = async (character_id: number) => {
	const url = "https://graphql.anilist.co",
		options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query,
				variables: { id: character_id },
			}),
		}
	const res = await fetch(url, options)

	const json = await res.json()
	return json.data.Character
}
export default characterQuery
