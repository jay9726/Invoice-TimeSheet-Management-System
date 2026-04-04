using ITSMS.Application.DTOs.Invoice;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.IRepositories
{
    public interface IInvoiceRepository
    {

        Task<List<Company>> GetCompaniesAsync(string? search = null);
        
        Task<IReadOnlyList<Client>> GetClientsByCompanyIdAsync(Guid companyId, int? page = null, int? limit = null, string? search = null);
       
        Task<int> GetClientCountByCompanyIdAsync(Guid companyId);
        
        Task<Invoice?> GetInvoiceByClientIdAsync(Guid clientId);

        Task<HashSet<Guid>> GetInvoiceItemProjectIdsAsync(Guid invoiceId);

        Task<bool> UpdateInvoiceTotalAsync(Guid invoiceId, decimal totalAmount);

        Task<bool> CreateInvoiceItemAsync(List<InvoiceItem> invoiceItem);

        Task<bool> SubmitInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status);

        Task<Project?> GetPaymentTermsByIdAsync(Guid clientId);

        Task<Client?> GetClientWithCompanyAsync(Guid clientId);
        Task<CompanyBankDetail?> GetActiveBankDetailByCompanyIdAsync(Guid companyId);

        Task<List<Project>> GetActiveProjectsByClientIdAsync(Guid clientId);

        Task<List<(Guid ProjectId, decimal Hours)>> GetBillableHoursByClientProjectAsync(
            Guid clientId, DateTime from, DateTime to);

        Task<Invoice?> GetInvoiceByIdAsync(Guid invoiceId);

        Task<List<Invoice>> GetInvoicesAsync(Guid? companyId, Guid? clientId, InvoiceStatus? status, int page, int pageSize);

        Task<(int totalCount, decimal totalBilled)> GetInvoiceDashboardAsync();

        Task<string> GenerateNextInvoiceNumberAsync(DateOnly invoiceDate);
        Task<string> GenerateNextProductOrderNumberAsync(DateOnly orderDate);

        Task<Guid> CreateInvoiceAsync(Invoice invoice);

        Task<bool> UpdateInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status);

        Task<List<ProjectInvoiceAggRow>> GetProjectAggFromTimeEntryAsync(Guid clientId);


        Task<Invoice?> GetInvoiceAndPONumber(Guid clientId);

        Task<List<Project>> GetProjectsByIdsAsync(List<string> projectIds);

        Task<bool> UpdateInvoiceItemsByProjectsAsync(Guid invoiceId, List<InvoiceProjectPreviewDto> projects);


    }
}
