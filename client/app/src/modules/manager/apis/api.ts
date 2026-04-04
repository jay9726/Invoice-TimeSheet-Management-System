import { api } from "@/lib/api"
import type { reportGeneratePayload } from "./types"

export const getEmployeeManager = async (search: string): Promise<any> => {
    const res = await api.get('/Manager/EmployeeForManager', {
        params: { search: search?.trim() || undefined, }
    })
    return res.data
}

export const getSubmittedsheetManager = async (employeeId: string): Promise<any> => {
    const res = await api.get(`/Manager/GetSubmittedSheetByEmployeeId?id=${employeeId}`)
    return res.data
}


export const submitReviewManager = async (managerId: string, payload: any): Promise<any> => {
    const res = await api.put(`/Manager/TimeSheetApprovManager?managerId=${managerId}`, payload)
    return res
}

export const generateMonthlyReport = async (payload: reportGeneratePayload): Promise<any> => {
    const res = await api.post(`/Manager/employee-monthly`, payload)
    return res.data
}