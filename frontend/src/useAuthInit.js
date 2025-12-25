import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAccessToken, markRefreshAttempted } from './auth/authSlice'
import { toast } from 'react-toastify'

export function useAuthInit() {
    const dispatch = useDispatch()
    const { accessToken, refreshAttempted } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!accessToken && !refreshAttempted) {
            fetch('http://localhost:5000/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                    toast.error(res.message)
                })
                .then((data) => {
                    dispatch(setAccessToken({ accessToken: data.accessToken, user: data.user }))
                })
                .catch(() => {
                    dispatch(markRefreshAttempted())
                })
        }
    }, [accessToken, refreshAttempted, dispatch])
}
