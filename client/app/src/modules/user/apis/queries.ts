import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getAllEmployeeApi, getEmployeeById } from "./api"

export const useGetAllEmployee = (page?: number, limit?: number, search?: string) => {
    return useQuery({
        queryKey: ['get-all-employee', page?? 0, limit ?? 0, search ?? ""],
        queryFn: () => getAllEmployeeApi(page, limit, search),
        retry: false,
    })
}


export const useGetEmployeeById = (employeeId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-employee-by-id', employeeId],
        queryFn: () => getEmployeeById(employeeId),
        retry: false,
    });
}