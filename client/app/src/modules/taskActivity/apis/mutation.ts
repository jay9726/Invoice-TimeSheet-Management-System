import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { CreateTimeEntryResponse } from "./types";
import type { taskActivityPayload } from "../schemas/taskActivitySchema";
import { createTimeEntryApi, deleteTimeActivityApi, timeSheetSubmitApi, updateTimeActivityApi } from "./api";

export const useCreateTimeEntry = (
    options?: UseMutationOptions<
        ApiResponse<CreateTimeEntryResponse>, Error, { employeeId: string, payload: taskActivityPayload[] }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-timeentry'],
        mutationFn: ({ employeeId, payload }) => createTimeEntryApi(employeeId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['create-timeentry'] });
        },
        ...options
    })
}


export const useTimeSheetSubmit = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, string>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['submit-timeSheet'],
        mutationFn: (payload) => timeSheetSubmitApi(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-timesheet'] });
        },
        ...options
    })
}


export const useUpdateTimeActivity = (
    options?: UseMutationOptions<
        ApiResponse<CreateTimeEntryResponse>, Error, { taskId: string, payload: taskActivityPayload }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-timeactivity'],
        mutationFn: ({ taskId, payload }) => updateTimeActivityApi(taskId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-taskactivity'] });
        },
        ...options,
    })
}

export const useDeleteTimeActivity = (
    options?: UseMutationOptions<
        ApiResponse<any>, Error, { taskId: string }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['dalete-timeactivity'],
        mutationFn: ({ taskId }) => deleteTimeActivityApi(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-all-taskactivity'] });
        },
        ...options,
    })
}
