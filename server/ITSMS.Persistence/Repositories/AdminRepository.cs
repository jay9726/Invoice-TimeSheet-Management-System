using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ITSMS.Persistence.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ITSMSDbContext _db;

        public AdminRepository(ITSMSDbContext db)
        {
            _db = db;
        }


        public async Task<IReadOnlyList<Company>> GetAdminCompanyForInvoiceAsync(int? page = null, int? limit = null, string? search = null)
        {
            IQueryable<Company> query = _db.Set<Company>().AsNoTracking();


            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                query = query.Where(x =>
                    (x.CompanyName != null && EF.Functions.Like(x.CompanyName, $"%{term}%")) ||
                    (x.AddressLine1 != null && EF.Functions.Like(x.AddressLine1, $"%{term}%")) ||
                    (x.Country != null && EF.Functions.Like(x.Country, $"%{term}%")) ||
                    (x.State != null && EF.Functions.Like(x.State, $"%{term}%")) ||
                    (x.City != null && EF.Functions.Like(x.City, $"%{term}%")) ||
                    (x.Zip != null && EF.Functions.Like(x.Zip, $"%{term}%"))
                );
            }

            bool isPaging = (page > 0 && limit > 0);

            if (isPaging)
            {
                query = query.OrderBy(x => x.CompanyName);
            }

            if (!isPaging)
            {
                return await query.OrderBy(x => x.CompanyName).ToListAsync();
            }

            if (page < 0 || limit < 0)
            {
                throw new ArgumentException("page and limit must be greater than 0.");
            }

            int skip = (page!.Value - 1) * limit!.Value;

            return await query.Skip(skip).Take(limit.Value).ToListAsync();

        }



        public async Task<IReadOnlyList<Client>> GetClientByCompanyId(Guid companyId)
        {
            return await _db.Clients.Where(x => x.CompanyId == companyId).ToListAsync();
        }

        public async Task<int> GetTotalInvoiceByClientId(Guid clientId)
        {
            return await _db.Invoices
                .AsNoTracking()
                .Where(x => x.ClientId == clientId)
                .Where(x => x.Status == InvoiceStatus.SUBMITTED ||
                x.Status == InvoiceStatus.FINALIZED ||
                x.Status == InvoiceStatus.PAID).CountAsync();
        }

        public async Task<IReadOnlyList<Invoice>> GetInvoiceByClientId(Guid clientId, string? search)
        {
            IQueryable<Invoice> query = _db.Invoices
                .AsNoTracking()
                .Where(x => x.ClientId == clientId)
                .Where(x => x.Status == InvoiceStatus.SUBMITTED ||
                x.Status == InvoiceStatus.FINALIZED ||
                x.Status == InvoiceStatus.PAID);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search}%";

                query = query.Where(x =>
                    (x.InvoiceNumber != null && EF.Functions.Like(x.InvoiceNumber, term)) ||
                    (x.PONumber != null && EF.Functions.Like(x.PONumber, term))
                );
            }



            return await query.ToListAsync();
        }

        public async Task<Invoice?> GetInvoiceById(Guid id)
        {
            return await _db.Invoices.FirstOrDefaultAsync(x => x.InvoiceId == id);
        }




        public async Task<(IReadOnlyList<(Client Client, Invoice Invoice)> Data, int TotalCount)>
    GetAdminClientInvoicesAsync(Guid companyId, string? search)
        {
            IQueryable<Invoice> invoiceQuery = _db.Invoices
                .AsNoTracking()
                .Include(x => x.Client)
                .Where(x => x.Client.CompanyId == companyId)
                .Where(x =>
                    x.Status == InvoiceStatus.SUBMITTED ||
                    x.Status == InvoiceStatus.FINALIZED ||
                    x.Status == InvoiceStatus.PAID);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim()}%";
                invoiceQuery = invoiceQuery.Where(x =>
                    (x.InvoiceNumber != null && EF.Functions.Like(x.InvoiceNumber, term)) ||
                    (x.PONumber != null && EF.Functions.Like(x.PONumber, term))
                );
            }

            var invoices = await invoiceQuery.ToListAsync();

            var totalCount = string.IsNullOrWhiteSpace(search)
                ? invoices.Count
                : await _db.Invoices
                      .AsNoTracking()
                      .Where(x => x.Client.CompanyId == companyId)
                      .Where(x =>
                          x.Status == InvoiceStatus.SUBMITTED ||
                          x.Status == InvoiceStatus.FINALIZED ||
                          x.Status == InvoiceStatus.PAID)
                      .CountAsync();

            var data = invoices
                .Select(inv => (Client: inv.Client, Invoice: inv))
                .ToList();

            return (data, totalCount);
        }

    }
}
