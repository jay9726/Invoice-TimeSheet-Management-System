import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getEmployeeManager, getSubmittedsheetManager } from "./api";

export const useGetEmployeeManager = (search: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-employeemanager', search ?? ""],
        queryFn: () => getEmployeeManager(search),
        retry: false,
        placeholderData: keepPreviousData,
    });
};

export const useGetsubmittedsheetByEmpIdManager = (employeeId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-submit-employee-manager', employeeId],
        queryFn: () => getSubmittedsheetManager(employeeId),
        retry: false,
    });
};