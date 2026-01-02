import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import styles from "./UserNavbar.module.css"
import logoutIcon from "../../assets/logout_16584919.png"
import { logout } from "../../auth/authSlice"
import { toast } from "react-toastify"


export default function UserNavbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
        } catch {
            toast.error("Something went wrong!")
        } finally {
            dispatch(logout())
            navigate("/login")
        }
    }
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div></div>
                <div className={styles.brand}>
                    <span>USER MANAGEMENT</span>
                    <span className={styles.badge}>User</span>
                </div>

                <div className={styles.right}>
                    <span onClick={() => navigate("/")} className={styles.link} role="button" tabIndex={0}>
                        Home
                    </span>
                    <span onClick={() => navigate("/user/profile")} className={styles.link} role="button" tabIndex={0}>
                        Profile
                    </span>
                    <button onClick={handleLogout} type="button" className={styles.primaryButton}>
                        <img src={logoutIcon} alt="logout" style={{ width: "24px", height: "24px" }} />
                        Logut
                    </button>
                </div>
            </div>
        </header>
    )
}
