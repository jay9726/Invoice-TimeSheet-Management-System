import { useAppSelector } from "@/lib/hooks"
import { Navigate, Outlet } from "react-router-dom"
import type { Roles } from "../apis/types"


interface requireRoleprops {
    allowedRole: Roles[]
}

export const RequireRole: React.FC<requireRoleprops> = ({ allowedRole }) => {

    const user = useAppSelector((state) => state.auth.user)

    if (!user) return <Navigate to='/' replace />
    if (!allowedRole.includes(user.role)) return <Navigate to='/' replace />

    return <Outlet />
}