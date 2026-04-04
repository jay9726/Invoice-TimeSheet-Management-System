import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { CreatBankDetailResponse, CreateBankDetailPayload, deleteBankDetailResponse } from "./types"

export const getBankDetail = async (page?: number, limit?: number, search?: string): Promise<any> => {
    const res = await api.get(`/CompanyBankDetail/GetAllBankDetails`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined,
        },
    })
    return res.data
}

export const getBankDetailById = async (compnayId: string) => {
    const res = await api.get(`/CompanyBankDetail/GetBankDetailById/${compnayId}`)
    return res.data
}


export const updateBankDetailStatusApi = async (bankDetailId: string, payload: boolean) => {
    const { data } = await api.put(`/CompanyBankDetail/UpdateBankDetailStatus/${bankDetailId}?status=${payload}`)
    return data
}

export const createBankDetailApi = async (payload: CreateBankDetailPayload): Promise<ApiResponse<CreatBankDetailResponse>> => {
    const { data } = await api.post("/CompanyBankDetail/CreateBankDetail", payload)
    return data.data
}

export const updateBankDetailApi = async (companyId: string, payload: CreateBankDetailPayload) => {
    const { data } = await api.put(`/CompanyBankDetail/UpdateBankDetail/${companyId}`, payload)
    return data
}

export const deleteBankDetailApi = async (payload: string): Promise<ApiResponse<deleteBankDetailResponse>> => {
    const { data } = await api.delete(`/CompanyBankDetail/DeleteBankDetail/${payload}`)
    return data.data

}