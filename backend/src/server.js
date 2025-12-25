import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/connectDb.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import path from "path"

dotenv.config({ path: "../.env" })

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")))
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})
