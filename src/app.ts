import express from "express"
import { config } from "dotenv"
import router from "./routes"
import { apiError } from "./middlewares/api-error"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { Server } from "socket.io"
import chat from "./controllers/chat"

config()

const app = express()
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5207"], credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true }))
app.use(express.static("client/build"))

app.use("/api", router)
app.use(apiError)
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "../client/build/index.html")))

const httpServer = app.listen(Number(process.env.HTTP_PORT), () =>
	console.log(`Server has started on port ${process.env.HTTP_PORT}`),
)

console.log(process.env.PG_URI)

const io = new Server(httpServer, {
	cors: { credentials: true, origin: ["http://localhost:3000", "http://localhost:5207"] },
})

chat(io)
