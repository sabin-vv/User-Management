import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import styles from "./AdminNavbar.module.css"
import logoutIcon from "../../assets/logout_16584919.png"
import { logout } from "../../auth/authSlice"

export default function AdminNavbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
        } catch {
            // proceed even if network error
        } finally {
            dispatch(logout())
            navigate("/admin")
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div
                    className={styles.brand}
                    onClick={() => navigate("/admin/home")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            navigate("/admin/home")
                        }
                    }}
                >
                    <span>USER MANAGEMENT</span>
                    <span className={styles.badge}>Admin</span>
                </div>

                <nav className={styles.nav} aria-label="Admin navigation">
                    <span
                        onClick={() => navigate("/admin/home")}
                        className={styles.link}
                        role="button"
                        tabIndex={0}
                    >
                        Dashboard
                    </span>
                    <span
                        onClick={() => navigate("/admin/users")}
                        className={styles.link}
                        role="button"
                        tabIndex={0}
                    >
                        Users
                    </span>
                    <span
                        onClick={() => navigate("/admin/reports")}
                        className={styles.link}
                        role="button"
                        tabIndex={0}
                    >
                        Reports
                    </span>
                </nav>

                <button onClick={handleLogout} type="button" className={styles.primaryButton}>
                    <img src={logoutIcon} alt="logout" className={styles.icon} />
                    Logout
                </button>
            </div>
        </header>
    )
}
