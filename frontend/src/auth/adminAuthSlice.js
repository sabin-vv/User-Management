import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  refreshAttempted: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.refreshAttempted = true;
      localStorage.setItem("adminHasSession", "true");
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.refreshAttempted = true;
    },
    markRefreshAttempted(state) {
      state.refreshAttempted = true;
    },
    logout(state) {
      state.admin = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.refreshAttempted = true;
      localStorage.removeItem("adminHasSession");
    },
  },
});
export const { loginSuccess, logout, setAccessToken, markRefreshAttempted } =
  adminAuthSlice.actions;
export default adminAuthSlice.reducer;
