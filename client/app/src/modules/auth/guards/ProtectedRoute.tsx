import React from "react";
import { useAppSelector } from "@/lib/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Roles } from "@/modules/auth/apis/types";

export const ProtectedRoute: React.FC<{ allowedRoles: Roles[] }> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/" state={{ from: location.pathname }} replace />;
    if (!user) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

    return <Outlet />;
};  