import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCompanies, getCompanyById } from "./api";

export const useGetCompany = (
  page?: number,
  limit?: number,
  search?: string
): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get-all-company', page ?? 0, limit ?? 0, search ?? ""],
    queryFn: () => getCompanies(page, limit, search),
    placeholderData: keepPreviousData,
    retry: false,
  });
};


export const useGetCompanyById = (companyId: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get-company-by-id', companyId],
    queryFn: () => getCompanyById(companyId),
    retry: false,
  });
}