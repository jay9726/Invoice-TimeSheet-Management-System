import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { taskActivityPayload } from "../schemas/taskActivitySchema"
import type { CreateTimeEntryResponse } from "./types"


export const createTimeEntryApi = async (employeeId: string, payload: taskActivityPayload[]): Promise<ApiResponse<CreateTimeEntryResponse>> => {
    const { data } = await api.post(`/TimeEntry?employeeId=${employeeId}`, payload)
    return data.data
}


export const getTimesheetByEmployeeIdApi = async (employeeId: string): Promise<any> => {
    const res = await api.get(`/Timesheet/GetTimesheetByEmployeeId?employeeId=${employeeId}`)
    return res.data
}


export const getTaskActivityFromTimesheetIdApi = async (employeeId: string, timesheetId: string): Promise<any> => {
    const res = await api.get(`/Timesheet/GetActivityFromTimsSheetId?employeeId=${employeeId}&timesheetId=${timesheetId}`)
    return res.data
}

export const getTimeSheetHistoryApi = async (employeeId: string): Promise<any> => {
    const res = await api.get(`/Timesheet/GetTimeSheetHistoryByEmployeeId?id=${employeeId}`)
    return res.data
}

export const getTimeEntryByTaskIdApi = async (taskId: string): Promise<any> => {
    const res = await api.get(`/TimeEntry/GetTimeEnteryByTaskId?taskId=${taskId}`)
    return res.data
}


export const timeSheetSubmitApi = async (payload: string): Promise<any> => {
    const res = await api.post(`/Timesheet/${payload}/SubmitTimeSheetByEmployee`)
    return res.data
}


export const updateTimeActivityApi = async (taskId: string, payload: taskActivityPayload): Promise<any> => {
    const res = await api.put(`/TimeEntry/UpdateTimeEntry?timeentryId=${taskId}`, payload)
    return res.data
}

export const deleteTimeActivityApi = async (taskId: string): Promise<any> => {
    const res = await api.delete(`/TimeEntry/DeleteTimeEntry?taskId=${taskId}`)
    return res.data
}