
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../schemas/auth.schema';
import styles from './SignupForm.module.css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function SignupForm({ isLoading = false, formMode }) {
    const { user } = useSelector((state) => state.auth)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(signupSchema)
    })
    if (user) {
        return <Navigate to="/" replace />
    }

    const onSubmit = async (data) => {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password
            })
        })
        const result = await res.json()

        if (!res.ok) {
            toast.error(result.message)
            return
        } else {
            toast.success(result.message)
            formMode("signin")
            return
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>UM</div>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join us today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} role="form" noValidate>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name='name'
                            placeholder="Enter your full name"
                            disabled={isLoading}
                            className={`${styles.input} ${errors.name ? styles.error : ''}`}
                            {...register("name")}
                        />
                        {errors.name && (
                            <span className={styles.errorMessage}>{errors.name.message}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name='email'
                            placeholder="Enter your email"
                            disabled={isLoading}
                            className={`${styles.input} ${errors.email ? styles.error : ''}`}
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            placeholder="Enter your password"
                            disabled={isLoading}
                            className={`${styles.input} ${errors.password ? styles.error : ''}`}
                            {...register("password")}
                        />
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name='confirmPassword'
                            placeholder="Confirm your password"
                            disabled={isLoading}
                            className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <button type='button' onClick={() => formMode("signin")} className={styles.footerButton}>Login here</button>
                </p>
            </div>
        </div>
    );
}
