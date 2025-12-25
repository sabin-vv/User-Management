/* eslint-disable no-unused-vars */
import bcrypt from "bcryptjs"
import process from "process"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExist = await User.findOne({ email })
        if (userExist)
            return res.status(409).json({ message: "User already exist" })

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })
        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        const userMatch = await bcrypt.compare(password, user.password)
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        )
        res.status(200).json({
            message: "Login successfull",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                date: user.createdAt,
                avatar: user.avatar,
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}