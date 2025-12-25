import express from "express"
import { protect, authorizeAdmin } from "../middleware/authMiddleware.js"
import { listUsers, createUser, updateUser, deleteUser } from "../controller/adminController.js"

const router = express.Router()

router.get("/users", protect, authorizeAdmin, listUsers)
router.post("/users", protect, authorizeAdmin, createUser)
router.put("/users/:id", protect, authorizeAdmin, updateUser)
router.delete("/users/:id", protect, authorizeAdmin, deleteUser)

export default router
