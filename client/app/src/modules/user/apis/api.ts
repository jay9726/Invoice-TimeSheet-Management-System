import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { CreatEmployeeResponse, deleteEmployeeResponse } from "./types"

export const getAllEmployeeApi = async (page?: number, limit?: number, search?: string): Promise<any> => {
    const res = await api.get(`/Employee/GetAllEmployee`,{
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined, 
        },
    })
    return res.data
}


export const getEmployeeById = async (employeeId: string) => {
    const res = await api.get(`/Employee/GetEmployeeById/${employeeId}`)
    return res.data
}

export const createEmployeeApi = async (payload: any): Promise<ApiResponse<CreatEmployeeResponse>> => {
    const { data } = await api.post("/Auth/create-user", payload)
    return data.data
}

export const updateEmployeeStatusApi = async (employeeId: string, payload: boolean) => {
    const { data } = await api.put(`Employee/UpdateEmployeeStatus/${employeeId}?status=${payload}`)
    return data
}

export const updateEmployeeApi = async (employeeId: string, payload: any) => {
    const { data } = await api.put(`/Employee/UpdateEmployee/${employeeId}`, payload)
    return data
}

export const deleteEmployeeApi = async (payload: string): Promise<ApiResponse<deleteEmployeeResponse>> => {
    const { data } = await api.delete(`/Employee/DeleteEmployee/${payload}`)
    return data.data

}