import { api } from "@/lib/api"

export const GetAdminDashboardApi = async () => {
    const res = await api.get('/Dashboard/AdminDashboard')
    return res.data
}

export const GetAccountUserDashboardApi = async () => {
    const res = await api.get('/Dashboard/AccountUserDashboard')
    return res.data
}

export const GetManagerDashboardApi = async () => {
    const res = await api.get('/Dashboard/ManagerDashboard')
    return res.data
}

export const GetEmployeeDashboardApi = async (employeeId: string) => {
    const res = await api.get(`/Dashboard/EmployeeDashboard?employeeId=${employeeId}`)
    return res.data
}