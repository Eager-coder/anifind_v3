export interface Post {
	post_id: String
	parent_id: String
	created_at: Number
	children: Array<Post>
}

export default function getNestedPosts(posts: Post[]) {
	let fetchedPosts = new Set()

	function dfs(post: Post) {
		post.children = []
		fetchedPosts.add(post.post_id)
		posts.forEach((post2: Post) => {
			if (!fetchedPosts.has(post2.post_id) && post2.parent_id == post.post_id) {
				post.children.push(dfs(post2))
			}
		})
		post.children.sort(function (a: any, b: any) {
			return a.created_at > b.created_at ? 1 : -1
		})
		return post
	}
	let nested = []
	for (let post of posts) {
		if (!fetchedPosts.has(post.post_id) && post.parent_id === null) {
			nested.push(dfs(post))
		}
	}
	nested.sort(function (a, b) {
		return a.created_at > b.created_at ? 1 : -1
	})
	return nested
}
