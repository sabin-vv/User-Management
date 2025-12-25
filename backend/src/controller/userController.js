import { User } from "../models/user.model.js"

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const avatarPath = `/uploads/${req.file.filename}`
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath }, { new: true })
            .select("-password")
        res.status(200).json({ message: "Profile picture Updated", user: updatedUser })
    } catch (err) {
        res.status(500).json({ message: "imgae upload failed" })
    }
}
export const profileUpdate = async (req, res) => {
    try {
        const { name, email } = req.body

        if (!email || !name) {
            return res.status(400).json({ message: "Name and email required" })
        }
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } })

        if (existingUser) {
            return res.status(400).json({ message: "This email  already in use" })
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select("-password")
        res.status(200).json({ message: "Profile updated Successfully", user: updatedUser })
    } catch {
        res.status(500).json({ message: "Server error" })
    }

}