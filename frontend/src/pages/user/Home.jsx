import UserNavbar from "../../components/Navbar/UserNavbar"
import { useSelector } from "react-redux"
import styles from "./Home.module.css"

export default function Home() {
    const { user } = useSelector((state) => state.auth)
    return (
        <>
            <UserNavbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.welcomeSection}>
                        <div className={styles.welcomeContent}>
                            <h1 className={styles.welcomeTitle}>
                                Welcome back, {user ? user.name : "guest"}!
                            </h1>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
