import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAccessToken, markRefreshAttempted } from './auth/authSlice'

export function useAuthInit() {
    const dispatch = useDispatch()
    const { accessToken, refreshAttempted } = useSelector((state) => state.auth)

    useEffect(() => {
        const hasSession = localStorage.getItem('hasSession')
        if (!accessToken && !refreshAttempted && hasSession) {
            fetch('http://localhost:5000/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                    throw new Error('No session')
                })
                .then((data) => {
                    dispatch(setAccessToken({ accessToken: data.accessToken, user: data.user }))
                })
                .catch(() => {
                    localStorage.removeItem('hasSession')
                    dispatch(markRefreshAttempted())
                })
        } else if (!hasSession) {
            dispatch(markRefreshAttempted())
        }
    }, [accessToken, refreshAttempted, dispatch])
}
