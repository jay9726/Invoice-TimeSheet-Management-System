import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getTaskActivityFromTimesheetIdApi, getTimeEntryByTaskIdApi, getTimesheetByEmployeeIdApi, getTimeSheetHistoryApi } from "./api";

export const useGetTimeSheetByEmployeeId = (employeeId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-timesheet', employeeId],
        queryFn: () => getTimesheetByEmployeeIdApi(employeeId),
        retry: false,
    });
};

export const useGetTaskActivityFromTimesheetId = (employeeId: string, timeSheetId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-taskactivity', employeeId, timeSheetId],
        queryFn: () => getTaskActivityFromTimesheetIdApi(employeeId, timeSheetId),
        retry: false,
    });
};


export const useTimsheetHistoryByEmployeeId = (employeeId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-timesheet-history', employeeId],
        queryFn: () => getTimeSheetHistoryApi(employeeId),
        retry: false,
    });
};


export const useGetTimeEntryByTaskId = (taskId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-timeentry-by-taskid', taskId],
        queryFn: () => getTimeEntryByTaskIdApi(taskId),
        retry: false,
    });
};