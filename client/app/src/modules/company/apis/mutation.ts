import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { CreatCompanyResponse, CreateCompanyPayload, deleteCompanyResponse, updateCompanyResponse } from "./types";
import type { companySchemaPayload } from "../schemas/companySchema";
import { createCompanyApi, deleteCompanyApi, updateCompanyApi, updateCompanyStatusApi } from "./api";

export const useCreateCompany = (
    options?: UseMutationOptions<
        ApiResponse<CreatCompanyResponse>, Error, CreateCompanyPayload>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-company'],
        mutationFn: (payload) => createCompanyApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-company'] });
        },
        ...options
    })
}

export const useUpdateCompany = (
    options?: UseMutationOptions<
        ApiResponse<updateCompanyResponse>, Error, { companyId: string, payload: companySchemaPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-company'],
        mutationFn: ({ companyId, payload }) => updateCompanyApi(companyId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-company'] })
        },
        ...options
    })
}

export const useDeleteCompany = (
    options?: UseMutationOptions<
        ApiResponse<deleteCompanyResponse>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-company'],
        mutationFn: (payload) => deleteCompanyApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-company'] })
        },
        ...options
    })
}

export const useUpdateCompanyStatus = (
    options?: UseMutationOptions<
        ApiResponse<deleteCompanyResponse>, Error, { companyId: string, status: boolean }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-company-status'],
        mutationFn: ({ companyId, status }) => updateCompanyStatusApi(companyId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-company'] })
        },
        ...options
    })
}



