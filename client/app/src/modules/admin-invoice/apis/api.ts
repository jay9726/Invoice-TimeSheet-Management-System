import { api } from "@/lib/api";

export const getAdminCompaniesForInvoiceApi = async (page?: number, limit?: number, search?: string) => {
    const res = await api.get(`/Admin/AdminCompaniesForInvoice`, {
        params: {
            page: page ?? 0,
            limit: limit ?? 0,
            search: search?.trim() || undefined,
        },
    });
    return res.data;
}

export const getAdminClientInvoiceApi = async (companyId: string, search?: string) => {
    const res = await api.get(`/Admin/AdminClientInvoice?companyId=${companyId}&search=${search}`)
    return res.data;
}

export const updateAdminInvoiceStatusApi = async (invoiceId: string, status: string) => {
    const res = await api.post(`/Admin/InvoiceDecision?invoiceId=${invoiceId}&status=${status}`);
    return res.data;
}
