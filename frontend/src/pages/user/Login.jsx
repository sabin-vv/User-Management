import { useState } from "react";
import LoginForm from "../../components/Auth/LoginForm";
import SignupForm from "../../components/Auth/SignupForm"
import { useSelector } from "react-redux";
import styles from './Login.module.css';
import { Navigate } from "react-router-dom";

export default function Login({ mode }) {
    const { user } = useSelector((state) => state.auth)
    const [loginMode, setMode] = useState(mode)
    if (user) {
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
