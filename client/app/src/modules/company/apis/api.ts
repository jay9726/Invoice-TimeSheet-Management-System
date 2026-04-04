import { api } from "@/lib/api"
import type { CreatCompanyResponse, CreateCompanyPayload, deleteCompanyResponse } from "./types"
import type { ApiResponse } from "@/types/api"
import type { companySchemaPayload } from "../schemas/companySchema"

export const getCompanies = async (page?: number, limit?: number, search?: string): Promise<any> => {
    const res = await api.get(`/Company/GetAllCompanies`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined,
        },
    })
    return res.data
}

export const getCompanyById = async (compnayId: string) => {
    const res = await api.get(`/Company/GetById/${compnayId}`)
    return res.data
}


export const updateCompanyStatusApi = async (companyId: string, payload: boolean) => {
    const { data } = await api.put(`/Company/UpdateCompanyStatus/${companyId}?status=${payload}`)
    return data
}

export const createCompanyApi = async (payload: CreateCompanyPayload): Promise<ApiResponse<CreatCompanyResponse>> => {
    const { data } = await api.post("/Company/AddCompany", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
}

export const updateCompanyApi = async (companyId: string, payload: companySchemaPayload) => {
    const { data } = await api.put(`/Company/UpdateCompany/${companyId}`, payload,{
        headers: { "Content-Type": "multipart/form-data" },
    })
    return data
}

export const deleteCompanyApi = async (payload: string): Promise<ApiResponse<deleteCompanyResponse>> => {
    const { data } = await api.delete(`/Company/DeleteCompany/${payload}`)
    return data.data

}