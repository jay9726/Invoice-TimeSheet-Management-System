using ITSMS.Domain.Entities;

namespace ITSMS.Application.IRepositories
{
    public interface IAdminRepository
    {
        Task<IReadOnlyList<Company>> GetAdminCompanyForInvoiceAsync(int? page = null, int? limit = null, string? search = null);
        Task<IReadOnlyList<Client>> GetClientByCompanyId(Guid companyId);
        Task<int> GetTotalInvoiceByClientId(Guid clientId);
        Task<IReadOnlyList<Invoice>> GetInvoiceByClientId(Guid clientId, string? search);
        Task<Invoice?> GetInvoiceById(Guid id);


        Task<(IReadOnlyList<(Client Client, Invoice Invoice)> Data, int TotalCount)> GetAdminClientInvoicesAsync(Guid companyId, string? search);
    }
}
