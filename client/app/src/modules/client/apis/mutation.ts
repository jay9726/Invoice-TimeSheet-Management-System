import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { CreatClientResponse, CreateClientPayload, deleteClientResponse, updateClientResponse } from "./types";
import type { clientPayload } from "../schemas/clientSchema";
import { createClientApi, deleteClientApi, updateClientApi, updateClientStatusApi } from "./api";

export const useCreateClient = (
    options?: UseMutationOptions<
        ApiResponse<CreatClientResponse>, Error, CreateClientPayload>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-client'],
        mutationFn: (payload) => createClientApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-client'] });
        },
        ...options
    })
}

export const useUpdateClient = (
    options?: UseMutationOptions<
        ApiResponse<updateClientResponse>, Error, { clientId: string, payload: clientPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-client'],
        mutationFn: ({ clientId, payload }) => updateClientApi(clientId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-client'] })
        },
        ...options
    })
}

export const useDeleteClient = (
    options?: UseMutationOptions<
        ApiResponse<deleteClientResponse>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-client'],
        mutationFn: (payload) => deleteClientApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-client'] })
        },
        ...options
    })
}

export const useUpdateClientStatus = (
    options?: UseMutationOptions<
        ApiResponse<deleteClientResponse>, Error, { clientId: string, status: boolean }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-client-status'],
        mutationFn: ({ clientId, status }) => updateClientStatusApi(clientId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-client'] })
        },
        ...options
    })
}



