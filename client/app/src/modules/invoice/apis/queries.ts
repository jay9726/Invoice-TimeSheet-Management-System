import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllCompaniesForInvoiceApi, getClientByCompanyIdApi, getInvoicePreviewByClientIdApi } from "./api"



export const useGetCompaniesForInvoice = (search?: string) => {
    return useQuery({
        queryKey: ['get-companies-for-invoice', search],
        queryFn: () => getAllCompaniesForInvoiceApi(search),
        placeholderData: keepPreviousData,
        retry: false,
    })
}

export const useGetClientByCompanyId = (companyId: string, page?: number, limit?: number, search?: string) => {
    return useQuery({
        queryKey: ["get-client-by-company-id", companyId, page ?? 0, limit ?? 0, search?.trim() ?? ""],
        queryFn: () => getClientByCompanyIdApi(companyId, page, limit, search),
        placeholderData: keepPreviousData,
        retry: false
    });
};


export const useGetInvoicePreviewByClientId = (clientId: string) => {
    return useQuery({
        queryKey: ['get-invoice-preview-by-client-id', clientId],
        queryFn: () => getInvoicePreviewByClientIdApi(clientId),
        placeholderData: keepPreviousData,
        retry: false,
    })
}