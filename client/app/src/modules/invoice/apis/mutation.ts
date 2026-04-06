import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { generateInvoiceApi, submitInvoiceApi, getInvoicePreviewByinvoiceIdApi } from "./api";


export const useGenerateInvoice = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, { userId: string, clientId: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['generate-invoice'],
        mutationFn: ({ userId, clientId }) => generateInvoiceApi(userId, clientId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generate-invoice'] })
        },
        ...options
    })
}


export const useSubmitInvoice = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, { invoiceId: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['submit-invoice'],
        mutationFn: ({ invoiceId }) => submitInvoiceApi(invoiceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submit-invoice'] })
        },
        ...options
    })
}


export const useInvoicePreview = (
    options?: UseMutationOptions<
        any, Error, { invoiceId: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['preview-invoice'],
        mutationFn: ({ invoiceId }) => getInvoicePreviewByinvoiceIdApi(invoiceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preview-invoice'] })
        },
        ...options
    })
}