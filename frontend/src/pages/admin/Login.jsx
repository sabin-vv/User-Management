import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import LoginForm from "../../components/Auth/LoginForm"
import styles from "../user/Login.module.css"

export default function AdminLogin() {
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    if (isAuthenticated && user?.role === "admin") {
        return <Navigate to="/admin/home" replace />
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                <LoginForm hideSignupToggle />
            </div>
        </div>
    )
}
