import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import LoginForm from "../../components/Auth/LoginForm"
import styles from "../user/Login.module.css"

export default function AdminLogin() {
    const { isAuthenticated, admin } = useSelector((state) => state.adminAuth)

    if (isAuthenticated && admin) {
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
