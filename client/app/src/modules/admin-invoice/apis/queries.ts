import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAdminClientInvoiceApi, getAdminCompaniesForInvoiceApi } from "./api"

export const useGetAdminCompaniesForInvoice = (page = 0, limit = 0, search?: string) => {
    return useQuery({
        queryKey: ['get-admin-companies-for-invoice', page, limit, search],
        queryFn: () => getAdminCompaniesForInvoiceApi(page, limit, search),
        placeholderData: keepPreviousData,
        retry: false,
    })
}

export const useGetAdminClientInvoice = (companyId: string, search?: string) => {
    return useQuery({
        queryKey: ['get-admin-client-invoice', companyId, search],
        queryFn: () => getAdminClientInvoiceApi(companyId, search),
        placeholderData: keepPreviousData,
        retry: false,
    })
}




