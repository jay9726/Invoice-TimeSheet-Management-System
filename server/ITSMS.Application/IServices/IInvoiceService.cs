using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Invoice;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.IServices
{
    public interface IInvoiceService
    {

        Task<APIResponse<List<GetInvoiceCompanyDTO>>> GetCompaniesAsync(string? search);
        Task<APIResponse<List<ClientMiniDto>>> GetClientsByCompanyIdAsync(Guid companyId, int? page, int? limit, string? search);
        Task<APIResponse<InvoicePreviewResponseDto>> GetInvoicePreviewAsync(Guid invoiceId);
        Task<APIResponse<SubmitInvoiceResponseDto>> GenerateInvoiceAsync(Guid userId, Guid clientId);
        Task<APIResponse<bool>> SubmitInvoiceAsync(Guid invoiceId);
        Task<APIResponse<bool>> UpdateInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status);
    }
}
