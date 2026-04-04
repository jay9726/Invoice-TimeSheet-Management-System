import { api } from "@/lib/api"
import type { loginPayload } from "../schemas/authSchema"

export const userLoginApi = async (payload: loginPayload) => {
    const res = await api.post('/Auth/login', payload)
    return res
}

export const createEmployeeApi = async (payload: any) => {
    const res = await api.post('/Auth/create-user', payload)
    return res.data
}

export const forgotPasswordApi = async (payload: any) => {
    const res = await api.post('/Auth/forgot-password', payload)
    return res.data
}

export const resetPasswordApi = async (payload: any) => {
    const res = await api.post('/Auth/reset-password', payload)
    return res.data
}