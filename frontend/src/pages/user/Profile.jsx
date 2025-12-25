import { useRef, useState } from "react"
import UserNavbar from "../../components/Navbar/UserNavbar"
import styles from "./Profile.module.css"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { loginSuccess } from "../../auth/authSlice"
import { profileSchema } from "../../schemas/profile.schema"
import { authFetch } from "../../utils/authFetch"
import { Navigate } from "react-router-dom"

export default function Profile() {
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const accessToken = useSelector((state) => state.auth.accessToken)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        date: user?.date || "2025"
    })

    const fileInputRef = useRef(null)
    const dispatch = useDispatch()

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const res = await fetch('http://localhost:5000/api/user/profile/avatar', {
                method: "PUT",
                headers: { Authorization: `Bearer ${accessToken}` },
                credentials: 'include',
                body: formData
            })
            const result = await res.json()
            if (!res.ok) {
                toast.error(result.message)
                return
            }
            dispatch(loginSuccess({
                accessToken,
                user: result.user
            }))
            toast.success("Profile picture updated");
        } catch {
            toast.error("upload failed ")
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = async () => {
        const validate = profileSchema.safeParse(formData)

        if (!validate.success) {
            toast.error(validate.error.issues[0].message)
            return
        }
        try {
            const res = await authFetch('http://localhost:5000/api/user/profile', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            }, dispatch)
            const result = await res.json()
            if (!res.ok) {
                toast.error(result.message)
                return
            }
            dispatch(loginSuccess({
                accessToken,
                user: result.user
            }))
            toast.success("Profile updated successfully");
            setIsEditing(false);

        } catch {
            toast.error("Failed to update Profile")
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || ""
        })
        setIsEditing(false)
    }

    return (
        <>
            {!isAuthenticated && <Navigate to="/login" replace />}
            <UserNavbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>My Profile</h1>
                        <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className={styles.profileCard}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar} onClick={() => fileInputRef.current.click()} >
                                {user?.avatar ?
                                    (<img className={styles.avatarImage} src={`http://localhost:5000${user.avatar}`} alt="profile" />)
                                    : (user?.name?.charAt(0)?.toUpperCase())}
                            </div>

                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} style={{ display: "none" }} />

                            <div className={styles.nameSection}>
                                <h2 className={styles.fullName}>
                                    {user?.name || ""}
                                </h2>
                                <p className={styles.email}>{user?.email || ""}</p>
                            </div>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.formSection}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="location">Member Since</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={new Date(formData.date).toLocaleDateString('en-IN')}
                                    disabled
                                    className={styles.input} />
                            </div>

                        </div>
                        {isEditing && (
                            <div className={styles.actionButtons}>
                                <button
                                    type="button"
                                    className={styles.saveButton}
                                    onClick={handleSave} >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={handleCancel} >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

