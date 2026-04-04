import { useAppSelector } from "@/lib/hooks"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export const RequiredAuth = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <Outlet />
}

