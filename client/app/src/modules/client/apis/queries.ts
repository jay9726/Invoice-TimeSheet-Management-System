import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getClient, getClientAndProjectByCompayId, getClientById } from "./api";

export const useGetClient = (page?: number, limit?: number, search?: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-client', page ?? 0, limit ?? 0, search ?? ""],
        queryFn: () => getClient(page, limit, search),
        placeholderData: keepPreviousData,
        retry: false,
    });
};


export const useGetClientById = (clientId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-client-by-id', clientId],
        queryFn: () => getClientById(clientId),
        retry: false,
    });
}

export const useGetClientProjectByCompanyId = (companyId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-client-project-by-company-id', companyId],
        queryFn: () => getClientAndProjectByCompayId(companyId),
        retry: false,
    });
}