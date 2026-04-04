import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { CreateProjectPayload, CreatProjectResponse, deleteProjectResponse, updateProjectResponse } from "./types";
import type { projectPayload } from "../schemas/projectSchema";
import { createProjectApi, deleteProjectApi, updateProjectApi, updateProjectStatusApi } from "./api";

export const useCreateProject = (
    options?: UseMutationOptions<
        ApiResponse<CreatProjectResponse>, Error, CreateProjectPayload>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-project'],
        mutationFn: (payload) => createProjectApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-project'] });
        },
        ...options
    })
}

export const useUpdateProject = (
    options?: UseMutationOptions<
        ApiResponse<updateProjectResponse>, Error, { projectId: string, payload: projectPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-project'],
        mutationFn: ({ projectId, payload }) => updateProjectApi(projectId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-project'] })
        },
        ...options
    })
}

export const useDeleteProject = (
    options?: UseMutationOptions<
        ApiResponse<deleteProjectResponse>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-project'],
        mutationFn: (payload) => deleteProjectApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-project'] })
        },
        ...options
    })
}

export const useUpdateProjectStatus = (
    options?: UseMutationOptions<
        ApiResponse<deleteProjectResponse>, Error, { projectId: string, status: boolean }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-client-status'],
        mutationFn: ({ projectId, status }) => updateProjectStatusApi(projectId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-project'] })
        },
        ...options
    })
}



