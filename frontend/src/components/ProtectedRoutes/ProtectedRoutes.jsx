import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, role }) {
    const auth = useSelector((state) => state.auth)
    const adminAuth = useSelector((state) => state.adminAuth)
    
    const isAuthenticated = role === "admin" ? adminAuth.isAuthenticated : auth.isAuthenticated
    const user = role === "admin" ? adminAuth.admin : auth.user
    
    if (!isAuthenticated) {
        return <Navigate to={role === "admin" ? "/admin" : "/login"} replace />
    }
    if (role && role === "admin" && !user) {
        return <Navigate to="/admin" replace />
    }
    if (role && role === "user" && (!user || user.role !== "user")) {
        return <Navigate to="/login" replace />
    }
    return children
};
