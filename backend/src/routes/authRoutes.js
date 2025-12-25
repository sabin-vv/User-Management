import express from "express"
import { login, signup, refresh, logout } from "../controller/authController.js"

const router = express.Router()
router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", logout)

export default router