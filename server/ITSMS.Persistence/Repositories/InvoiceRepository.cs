using ITSMS.Application.DTOs.Invoice;
using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;


namespace ITSMS.Persistence.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ITSMSDbContext _db;

        public InvoiceRepository(ITSMSDbContext db)
        {
            _db = db;
        }


        public Task<List<Company>> GetCompaniesAsync(string? search)
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

            return query.OrderBy(x => x.CompanyName).ToListAsync();
        }


        public async Task<IReadOnlyList<Client>> GetClientsByCompanyIdAsync(
    Guid companyId,
    int? page = null,
    int? limit = null,
    string? search = null
)
        {
            IQueryable<Client> query = _db.Clients.AsNoTracking()
                .Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());
                query = query.Where(x =>
                    x.ClientName != null && EF.Functions.Like(x.ClientName, $"%{term}%")
                );
            }

            bool isPaging = (page > 0 && limit > 0);

            if (!isPaging)
            {
                return await query.OrderBy(x => x.ClientName).ToListAsync();
            }

            if (page < 0 || limit < 0)
                throw new ArgumentException("page and limit must be greater than 0.");

            int skip = (page!.Value - 1) * limit!.Value;

            return await query
                .OrderBy(x => x.ClientName)
                .Skip(skip)
                .Take(limit.Value)
                .ToListAsync();
        }


        public async Task<int> GetClientCountByCompanyIdAsync(Guid companyId)
        {
            return await _db.Clients.Where(x => x.CompanyId == companyId).CountAsync();
        }


        public async Task<bool> UpdateInvoiceTotalAsync(Guid invoiceId, decimal totalAmount)
        {
            var inv = await _db.Invoices.FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);
            if (inv == null) return false;

            inv.TotalAmount = totalAmount;
            await _db.SaveChangesAsync();
            return true;
        }



        public async Task<HashSet<Guid>> GetInvoiceItemProjectIdsAsync(Guid invoiceId)
        {
            return await _db.InvoiceItems.AsNoTracking()
                .Where(x => x.InvoiceId == invoiceId)
                .Select(x => x.ProjectId)
                .ToHashSetAsync();
        }


        public Task<Client?> GetClientWithCompanyAsync(Guid clientId)
            => _db.Clients.AsNoTracking()
                .Include(x => x.Companies)
                .FirstOrDefaultAsync(x => x.ClientId == clientId);


        public Task<Invoice?> GetInvoiceByClientIdAsync(Guid clientId)
          => _db.Invoices.AsNoTracking()
              .Where(x => x.ClientId == clientId).FirstOrDefaultAsync();




        public Task<CompanyBankDetail?> GetActiveBankDetailByCompanyIdAsync(Guid companyId)
            => _db.CompanyBankDetails.AsNoTracking()
                .Where(x => x.CompanyId == companyId && x.IsActive)
                .OrderByDescending(x => x.BankDetailId)
                .FirstOrDefaultAsync();


        public async Task<List<ProjectInvoiceAggRow>> GetProjectAggFromTimeEntryAsync(Guid clientId)
        {
            return await _db.TimeEntries.AsNoTracking()
                .Where(t =>
                    t.ClientId == clientId &&
                    t.IsBillable &&
                    t.Timesheet.Status == TimeSheetStatus.APPROVED

                )
                .GroupBy(t => t.ProjectId)
                .Select(g => new ProjectInvoiceAggRow
                {
                    ProjectId = g.Key.ToString(),
                    TotalHours = g.Sum(x => x.HoursWorked),
                    FromDate = g.Min(x => x.WorkDate),
                    ToDate = g.Max(x => x.WorkDate)
                })
                .ToListAsync();
        }


        public Task<List<Project>> GetProjectsByIdsAsync(List<string> projectIds)
            => _db.Projects.AsNoTracking()
                .Where(p => projectIds.Contains(p.ProjectId.ToString()) && p.IsActive)
                .ToListAsync();

        public async Task<Project?> GetPaymentTermsByIdAsync(Guid clientId)
        {
            return await _db.Projects.FirstOrDefaultAsync(x => x.ClientId == clientId);
        }


        public Task<Invoice?> GetInvoiceByIdAsync(Guid invoiceId)
            => _db.Invoices.AsNoTracking()
                .Include(x => x.Company)
                .Include(x => x.Client)
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);


        public async Task<bool> UpdateInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status)
        {
            var inv = await _db.Invoices.FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);
            if (inv == null) return false;

            inv.Status = status;
            await _db.SaveChangesAsync();
            return true;
        }



        public async Task<string> GenerateNextInvoiceNumberAsync(DateOnly invoiceDate)
        {
            var year = invoiceDate.Year;

            var last = await _db.Invoices.AsNoTracking()
                .Where(x => x.InvoiceDate.Year == year)
                .OrderByDescending(x => x.InvoiceId)
                .Select(x => x.InvoiceNumber)
                .FirstOrDefaultAsync();

            int nextSeq = 1;
            if (!string.IsNullOrWhiteSpace(last))
            {

                var parts = last.Split('-');
                var lastPart = parts.LastOrDefault();
                if (lastPart != null && int.TryParse(lastPart, out var lastSeq))
                    nextSeq = lastSeq + 1;
            }

            return $"INV-{year}-{nextSeq:00000}";
        }


        public async Task<string> GenerateNextProductOrderNumberAsync(DateOnly orderDate)
        {
            var year = orderDate.Year;

            var last = await _db.Invoices.AsNoTracking()
                .Where(x => x.InvoiceDate.Year == year)
                .OrderByDescending(x => x.InvoiceId)
                .Select(x => x.InvoiceNumber)
                .FirstOrDefaultAsync();

            int nextSeq = 1;

            if (!string.IsNullOrWhiteSpace(last))
            {
                var parts = last.Split('-');
                var lastPart = parts.LastOrDefault();

                if (lastPart != null && int.TryParse(lastPart, out var lastSeq))
                    nextSeq = lastSeq + 1;
            }

            return $"ORD-{year}-{nextSeq:00000}";
        }


        public async Task<Guid> CreateInvoiceAsync(Invoice invoice)
        {
            _db.Invoices.Add(invoice);
            await _db.SaveChangesAsync();
            return invoice.InvoiceId;
        }


        public async Task<bool> CreateInvoiceItemAsync(List<InvoiceItem> invoiceItem)
        {
            await _db.InvoiceItems.AddRangeAsync(invoiceItem);
            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<bool> SubmitInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status)
        {
            var inv = await _db.Invoices.FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);
            if (inv == null) return false;

            inv.Status = status;
            await _db.SaveChangesAsync();
            return true;
        }



        public async Task<bool> UpdateInvoiceItemsByProjectsAsync(Guid invoiceId, List<InvoiceProjectPreviewDto> projects)
        {
            var projectIds = projects.Select(p => Guid.Parse(p.ProjectId)).ToList();

            var existingItems = await _db.InvoiceItems
                .Where(x => x.InvoiceId == invoiceId && projectIds.Contains(x.ProjectId))
                .ToListAsync();

            foreach (var item in existingItems)
            {
                var updated = projects.First(p => Guid.Parse(p.ProjectId) == item.ProjectId);
                item.Quantity = updated.TotalHours;
                item.Rate = updated.Rate;
                item.Amount = updated.Amount;
                item.FromDate = updated.FromDate;
                item.ToDate = updated.ToDate;
                item.Description = updated.ProjectName;
            }

            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<List<ProjectInvoiceAggRow>> GetGeneratedInvoiceProjectAsync(Guid invoiceId)
        {
            return await _db.InvoiceItems.AsNoTracking()
                .Where(t => t.InvoiceId == invoiceId)
                .GroupBy(t => t.ProjectId)
                .Select(g => new ProjectInvoiceAggRow
                {
                    ProjectId = g.Key.ToString(),
                    TotalHours = g.Sum(x => x.Quantity),
                    FromDate = g.Min(x => x.FromDate),
                    ToDate = g.Max(x => x.ToDate)
                })
                .ToListAsync();
        }


        public async Task<List<InvoiceItem>> GetGeneratedInvoiceProjectsByIdsAsync(List<string> projectIds)
           => await _db.InvoiceItems.AsNoTracking()
               .Where(p => projectIds.Contains(p.ProjectId.ToString()))
               .ToListAsync();
    }
}
