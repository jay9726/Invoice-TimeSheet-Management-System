import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { LoginResponse } from "./types";
import type { loginPayload } from "../schemas/authSchema";
import { createEmployeeApi, forgotPasswordApi, resetPasswordApi, userLoginApi } from "./api";

export const useUserLogin = (
    options?: UseMutationOptions<
        ApiResponse<LoginResponse>, Error, loginPayload>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['user-login'],
        mutationFn: (payload) => userLoginApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-login'] })
        },
        ...options
    })
}


export const useCreateEmployee = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, any>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-employee'],
        mutationFn: (payload) => createEmployeeApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-employee'] })
        },
        ...options
    })
}


export const useForgotPassword = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, any>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: (payload) => forgotPasswordApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forgot-password'] })
        },
        ...options
    })
}

export const useResetPassword = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, any>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['reset-password'],
        mutationFn: (payload) => resetPasswordApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forgot-password'] })
        },
        ...options
    })
}


