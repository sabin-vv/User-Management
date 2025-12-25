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

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "Login successfull",
            accessToken,
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

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" })
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        )

        const user = await User.findById(decoded.id)
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )

        const newRefreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        user.refreshToken = newRefreshToken
        await user.save()

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            }
        })

    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Invalid or expired refresh token" })
        }
        res.status(500).json({ message: err.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            const decoded = jwt.decode(refreshToken)
            if (decoded?.id) {
                await User.findByIdAndUpdate(decoded.id, { refreshToken: "" })
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}