import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getBankDetail, getBankDetailById } from "./apis";

export const useGetBankDetail = (page?: number, limit?: number, search?: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-all-bankdetail',  page ?? 0, limit ?? 0, search ?? ""],
        queryFn: () => getBankDetail(page, limit, search),
        retry: false,
    });
};


export const useGetBankDetailById = (bankDetailId: string): UseQueryResult<any> => {
    return useQuery({
        queryKey: ['get-company-by-id', bankDetailId],
        queryFn: () => getBankDetailById(bankDetailId),
        retry: false,
    });
}