using ITSMS.Application.DTOs.Admin;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Invoice;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.IServices
{
    public interface IAdminService
    {
        Task<APIResponse<List<AdminCompanyDTO>>> GetAdminCompaniesForInvoiceAsync(int? page, int? limit, string? search);
        Task<APIResponse<List<AdminInvoiceResponseDTO>>> GetAdminClientInvoice(Guid companyId, string? search);
        Task<APIResponse<bool>> InvoiceDecision(Guid invoiceId, InvoiceStatus status);

    }
}
