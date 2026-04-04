import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { updateAdminInvoiceStatusApi } from "./api";

export const useUpdateInvoiceStatus = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, { invoiceId: string, status: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-invoice'],
        mutationFn: ({ invoiceId, status }) => updateAdminInvoiceStatusApi(invoiceId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-admin-client-invoice'] })
        },
        ...options
    })
}