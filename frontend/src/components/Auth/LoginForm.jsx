import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/auth.schema';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../auth/authSlice';
import { loginSuccess as adminLoginSuccess } from '../../auth/adminAuthSlice';
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';

export default function LoginForm({ isLoading = false, formMode, hideSignupToggle = false }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data) => {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        const result = await response.json()

        if (!response.ok) {
            toast.error(result.message)
            return
        }
        toast.success(result.message)
        if (result.user.role === 'user') {
            dispatch(loginSuccess(result))
            navigate("/")
        }
        if (result.user.role === 'admin') {
            dispatch(adminLoginSuccess({ admin: result.user, accessToken: result.accessToken }))
            navigate("/admin/home")
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>UM</div>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} role="form" noValidate>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@domain.com"
                            autoComplete="email"
                            autoFocus
                            disabled={isLoading}
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={`${styles.input} ${errors.email ? styles.error : ''}`}
                            {...register("email")}
                        />
                        {errors.email && (
                            <span id="email-error" role="alert" className={styles.errorMessage}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={isLoading}
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            className={`${styles.input} ${errors.password ? styles.error : ''}`}
                            {...register("password")}
                        />
                        {errors.password && (
                            <span id="password-error" role="alert" className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton} >
                        {isLoading ? 'Logging in...' : 'Sign in'}
                    </button>
                </form>

                {!hideSignupToggle && (
                    <p className={styles.footer}>
                        Don't have an account?{' '}
                        <button type='button' onClick={() => formMode("signup")} className={styles.footerButton}>Sign up</button>
                    </p>
                )}
            </div>
        </div>
    );
}
