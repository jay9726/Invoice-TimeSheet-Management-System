import { api } from "@/lib/api";

export const getAllCompaniesForInvoiceApi = async (search?: string) => {
    const res = await api.get(`/Invoice/companies?search=${search}`);
    return res.data;
}

export const getClientByCompanyIdApi = async (companyId: string, page?: number, limit?: number, search?: string) => {
    const res = await api.get(`/Invoice/companies/${companyId}/clients`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() ? search.trim() : null
        }
    });

    return res.data;
};


export const getInvoicePreviewByClientIdApi = async (clientId: string) => {
    const res = await api.get(`/Invoice/preview?clientId=${clientId}`);
    return res.data;
}


export const generateInvoiceApi = async (userId: string, clientId: string) => {
    const res = await api.post(`/Invoice/GenerateInvoice?userId=${userId}&clientId=${clientId}`);
    return res.data;
}

export const submitInvoiceApi = async (invoiceId: string) => {
    const res = await api.post(`/Invoice/SubmitInvoice?invoiceId=${invoiceId}`);
    return res.data;
}