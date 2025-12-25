import { useState } from "react";
import LoginForm from "../../components/Auth/LoginForm";
import SignupForm from "../../components/Auth/SignupForm"
import { useSelector } from "react-redux";
import styles from './Login.module.css';
import { Navigate } from "react-router-dom";

export default function Login({ mode }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const [loginMode, setMode] = useState(mode)
    if (isAuthenticated && user?.role === "admin") {
        return <Navigate to="/admin/home" replace />
    }
    if (isAuthenticated && user) {
        return <Navigate to="/" replace />
    }
    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                {loginMode === "signin" ? <LoginForm formMode={setMode} />
                    : <SignupForm formMode={setMode} />}
            </div>
        </div>
    )
};
