import { Client, Pool } from "pg"
import { config } from "dotenv"
config()
// const pool = new Pool({
// 	user: process.env.PG_USER,
// 	host: process.env.PG_HOST,
// 	database: process.env.PG_DB,
// 	password: process.env.PG_PASSWORD,
// 	port: Number(process.env.PG_PORT),
// 	ssl: true,

// 	min: 1,
// 	max: 3,
// })
const pool = new Pool({
	connectionString: process.env.PG_URI,
	// ssl: {
	// 	rejectUnauthorized: false,
	// },
	min: 5,
	max: 8,
})

export default pool
