import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRoutes({ children, role }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    if (role && user.role !== role) {
        return <Navigate to="/login" replace />
    }
    return children
};
