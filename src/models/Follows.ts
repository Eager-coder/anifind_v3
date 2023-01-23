import pool from "../config/db"

const Follows = {
	async getFollowers(user_id: string) {
		const { rows } = await pool.query(
			`
      SELECT 
        username, avatar_url
      FROM users
      LEFT JOIN follows
        ON users.id = follows.follower_id
      WHERE 
        follows.followed_id = $1    
    `,
			[user_id]
		)
		return rows
	},
	async getFollowings(user_id: string) {
		const { rows } = await pool.query(
			`
				SELECT 
					username, avatar_url
				FROM users
				LEFT JOIN follows
					ON users.id = follows.followed_id
				WHERE 
					follows.follower_id = $1
			`,
			[user_id]
		)
		return rows
	},
	async isFollowed(followed_id: string, follower_id: string) {
		const { rows } = await pool.query(
			`
			SELECT 
				follower_id
			FROM 
				follows 
			WHERE followed_id = $1 AND follower_id = $2`,
			[followed_id, follower_id]
		)
		return rows.length > 0
	},
	async follow(follower_id: string, followed_id: string) {
		await pool.query(
			`
			INSERT INTO follows
				(follower_id, followed_id)
			VALUES 
				($1, $2) 
			ON CONFLICT 
				(follower_id, followed_id)
			DO NOTHING
		`,
			[follower_id, followed_id]
		)
	},
	async unfollow(follower_id: string, followed_id: string) {
		await pool.query(
			`
		DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2
		`,
			[follower_id, followed_id]
		)
	},
}
export default Follows
