import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { generateMonthlyReport, submitReviewManager } from "./api";
import type { ApiResponse } from "@/types/api";
import type { reportGeneratePayload, reviewSubmitResponse } from "./types";

export const useReviewSubmitManager = (
    options?: UseMutationOptions<
        ApiResponse<reviewSubmitResponse>, Error, { managerId: string, payload: any }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['review-submit-manager'],
        mutationFn: ({ managerId, payload }) => submitReviewManager(managerId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-submit-employee-manager'] })
        },
        ...options
    })
}


export const useGenerateMonthlyReport = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, { payload: reportGeneratePayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['generate-monthly-report'],
        mutationFn: ({ payload }) => generateMonthlyReport(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-employeemanager'] })
        },
        ...options
    })

}