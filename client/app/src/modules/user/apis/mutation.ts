import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { deleteEmployeeResponse, updateEmployeeResponse } from "./types";
import { deleteEmployeeApi, updateEmployeeApi, updateEmployeeStatusApi } from "./api";
import type { updateUserPayload } from "../schemas/userSchemas";


export const useUpdateEmployee = (
    options?: UseMutationOptions<
        ApiResponse<updateEmployeeResponse>, Error, { employeeId: string, payload: updateUserPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-employee'],
        mutationFn: ({ employeeId, payload }) => updateEmployeeApi(employeeId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-employee'] })
        },
        ...options
    })
}

export const useDeleteEmployee = (
    options?: UseMutationOptions<
        ApiResponse<deleteEmployeeResponse>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-employee'],
        mutationFn: (payload) => deleteEmployeeApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-employee'] })
        },
        ...options
    })
}


export const useUpdateEmployeeStatus = (
    options?: UseMutationOptions<
        ApiResponse<deleteEmployeeResponse>, Error, { employeeId: string, status: boolean }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-employee-status'],
        mutationFn: ({ employeeId, status }) => updateEmployeeStatusApi(employeeId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-employee'] })
        },
        ...options
    })
}



