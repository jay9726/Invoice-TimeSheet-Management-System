import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { CreatClientResponse, CreateClientPayload, deleteClientResponse } from "./types"

export const getClient = async (page?: number, limit?: number, search?: string): Promise<any> => {
    const res = await api.get(`/Clients/GetAllClients`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined,
        },
    })
    return res.data
}

export const getClientById = async (clientId: string) => {
    const res = await api.get(`/Clients/GetClientById/${clientId}`)
    return res.data
}


export const updateClientStatusApi = async (clientId: string, payload: boolean) => {
    const { data } = await api.put(`/Clients/UpdateClientStatus/${clientId}?status=${payload}`)
    return data
}

export const createClientApi = async (payload: CreateClientPayload): Promise<ApiResponse<CreatClientResponse>> => {
    const { data } = await api.post("/Clients/CreateClient", payload)
    return data.data
}

export const updateClientApi = async (companyId: string, payload: CreateClientPayload) => {
    const { data } = await api.put(`/Clients/UpdateClient/${companyId}`, payload)
    return data
}

export const deleteClientApi = async (payload: string): Promise<ApiResponse<deleteClientResponse>> => {
    const { data } = await api.delete(`/Clients/DeleteClient/${payload}`)
    return data.data
}


export const getClientAndProjectByCompayId = async (companyId: string) => {
    const res = await api.get(`/Clients/clients-projects?companyId=${companyId}`)
    return res.data
}
