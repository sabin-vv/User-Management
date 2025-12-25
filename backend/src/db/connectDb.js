import mongoose from "mongoose"
import dotenv from "dotenv"
import process from "process"
import path from "path"

dotenv.config({ path: path.resolve(".env") })


export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    try {
        await mongoose.connect(uri)
        console.log("mongoDB connected")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        process.exit(1)
    }
} 