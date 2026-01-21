import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice"
import adminAuthReducer from "../auth/adminAuthSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer
    }
})