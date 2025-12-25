import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"

export const listUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.status(200).json({ users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email, password required" })
        }
        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(409).json({ message: "User already exist" })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashed, role })
        const result = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        res.status(201).json({ message: "User created", user: result })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, role, password } = req.body

        const existingEmailUser = email ? await User.findOne({ email, _id: { $ne: id } }) : null
        if (existingEmailUser) {
            return res.status(409).json({ message: "Email already in use" })
        }

        const update = {}
        if (name !== undefined) update.name = name
        if (email !== undefined) update.email = email
        if (role !== undefined) update.role = role
        if (password) {
            update.password = await bcrypt.hash(password, 10)
        }

        const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "User updated", user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "User deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
