import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"; import type { CreatBankDetailResponse, CreateBankDetailPayload, deleteBankDetailResponse, updateBankDetailResponse } from "./types";
import type { bankDetailPayload } from "../schemas/bankDetailSchema";
import { createBankDetailApi, deleteBankDetailApi, updateBankDetailApi, updateBankDetailStatusApi } from "./apis";


export const useCreateBankDetail = (
    options?: UseMutationOptions<
        ApiResponse<CreatBankDetailResponse>, Error, CreateBankDetailPayload>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-bankdetail'],
        mutationFn: (payload) => createBankDetailApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-bankdetail'] });
        },
        ...options
    })
}

export const useUpdateBankDetail = (
    options?: UseMutationOptions<
        ApiResponse<updateBankDetailResponse>, Error, { bankDetailId: string, payload: bankDetailPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-bankdetail'],
        mutationFn: ({ bankDetailId, payload }) => updateBankDetailApi(bankDetailId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-bankdetail'] })
        },
        ...options
    })
}

export const useDeleteBankDetail = (
    options?: UseMutationOptions<
        ApiResponse<deleteBankDetailResponse>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-bankdetail'],
        mutationFn: (payload) => deleteBankDetailApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-bankdetail'] })
        },
        ...options
    })
}

export const useUpdateBankDetailStatus = (
    options?: UseMutationOptions<
        ApiResponse<deleteBankDetailResponse>, Error, { bankDetailId: string, status: boolean }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-company-status'],
        mutationFn: ({ bankDetailId, status }) => updateBankDetailStatusApi(bankDetailId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-bankdetail'] })
        },
        ...options
    })
}



