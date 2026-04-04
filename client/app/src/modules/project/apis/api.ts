import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { CreateProjectPayload, CreatProjectResponse, deleteProjectResponse } from "./types"

export const getProject = async (page?: number, limit?: number, search?: string): Promise<any> => {
    const res = await api.get(`/Project/GetAllProjects`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined, 
        },
    })
    return res.data
}

export const getProjectById = async (clientId: string) => {
    const res = await api.get(`/Project/GetProjectById/${clientId}`)
    return res.data
}

export const updateProjectStatusApi = async (clientId: string, payload: boolean) => {
    const { data } = await api.put(`/Project/UpdateProjectStatus/${clientId}?status=${payload}`)
    return data
}

export const createProjectApi = async (payload: CreateProjectPayload): Promise<ApiResponse<CreatProjectResponse>> => {
    const { data } = await api.post("/Project/CreateProject", payload)
    return data.data
}

export const updateProjectApi = async (companyId: string, payload: CreateProjectPayload) => {
    const { data } = await api.put(`/Project/UpdateProject/${companyId}`, payload)
    return data
}

export const deleteProjectApi = async (payload: string): Promise<ApiResponse<deleteProjectResponse>> => {
    const { data } = await api.delete(`/Project/DeleteProject/${payload}`)
    return data.data
}