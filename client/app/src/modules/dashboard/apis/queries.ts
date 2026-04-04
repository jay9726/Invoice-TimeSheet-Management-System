import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { GetAccountUserDashboardApi, GetAdminDashboardApi, GetEmployeeDashboardApi, GetManagerDashboardApi } from "./api"

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: () => GetAdminDashboardApi(),
        placeholderData: keepPreviousData,
        retry: false,
    })
}
export const useAccountUserDashboard = () => {
    return useQuery({
        queryKey: ['accountuser-dashboard'],
        queryFn: () => GetAccountUserDashboardApi(),
        placeholderData: keepPreviousData,
        retry: false,
    })
}

export const useManagerDashboard = () => {
    return useQuery({
        queryKey: ['manager-dashboard'],
        queryFn: () => GetManagerDashboardApi(),
        placeholderData: keepPreviousData,
        retry: false,
    })
}

export const useEmployeeDashboard = (employeeId: string) => {
    return useQuery({
        queryKey: ['employee-dashboard', employeeId],
        queryFn: () => GetEmployeeDashboardApi(employeeId),
        placeholderData: keepPreviousData,
        retry: false,
    })
}


