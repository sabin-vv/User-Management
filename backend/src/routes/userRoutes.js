import { upload } from "../middleware/upload.js";
import { profileUpdate, uploadProfileImage } from "../controller/userController.js";
import express from "express"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()
router.put("/profile/avatar", protect, upload.single("avatar"), uploadProfileImage)
router.put("/profile", protect, profileUpdate)

export default router 