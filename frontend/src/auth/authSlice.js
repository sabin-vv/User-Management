import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    refreshAttempted: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.refreshAttempted = true
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload.accessToken
            state.user = action.payload.user
            state.isAuthenticated = true
            state.refreshAttempted = true
        },
        markRefreshAttempted(state) {
            state.refreshAttempted = true
        },
        logout(state) {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            state.refreshAttempted = true
        }
    }
})
export const { loginSuccess, logout, setAccessToken, markRefreshAttempted } = authSlice.actions
export default authSlice.reducer