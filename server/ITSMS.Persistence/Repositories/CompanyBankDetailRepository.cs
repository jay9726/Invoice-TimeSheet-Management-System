using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ITSMS.Persistence.Repositories
{
    public class CompanyBankDetailRepository : ICompanyBankDetailRepository
    {
        private readonly ITSMSDbContext _context;
        public CompanyBankDetailRepository(ITSMSDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetBankDetailsCount()
        {
            return await _context.CompanyBankDetails.CountAsync();
        }

        public string GetPrimaryKeyName()
        {
            var entityType = _context.Model.FindEntityType(typeof(CompanyBankDetail));
            return entityType!.FindPrimaryKey()!.Properties.First().Name;
        }

        public async Task<IReadOnlyList<CompanyBankDetail>> GetAll(int? page = null, int? limit = null, string? search = null, Expression<Func<CompanyBankDetail, object>>? orderBy = null)
        {
            var primaryId = GetPrimaryKeyName();

            IQueryable<CompanyBankDetail> query = _context.Set<CompanyBankDetail>()
                .AsNoTracking();


            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                query = query.Where(x =>
                    (x.BankName != null && EF.Functions.Like(x.BankName, $"%{term}%")) ||
                    (x.SwiftCode != null && EF.Functions.Like(x.SwiftCode, $"%{term}%")) ||
                    (x.AccountName != null && EF.Functions.Like(x.AccountName, $"%{term}%")) ||
                    (x.AccountNumber != null && EF.Functions.Like(x.AccountNumber, $"%{term}%")) ||
                    (x.RoutingNumber != null && EF.Functions.Like(x.RoutingNumber, $"%{term}%"))
                );
            }

            bool isPaging = (page > 0 && limit > 0);

            if (isPaging)
            {
                query = query.OrderByDescending(x => EF.Property<object>(x, primaryId));
            }

            if (!isPaging)
            {
                return await query.ToListAsync();
            }

            if (page < 0 || limit < 0)
            {
                throw new ArgumentException("page and limit must be greater than 0.");
            }

            int skip = (page.Value - 1) * limit.Value;

            return await query.Skip(skip).Take(limit.Value).ToListAsync();
        }

        public async Task<CompanyBankDetail?> GetById(Guid id)
        {
            return await _context.Set<CompanyBankDetail>()
                .FirstOrDefaultAsync(x => x.BankDetailId == id);
        }

        public async Task<IReadOnlyList<CompanyBankDetail>> GetBankDetailByCompanyId(Guid companyId)
        {
            return await _context.CompanyBankDetails
                .AsNoTracking()
                .Include(x => x.Company)
                .Where(x => x.CompanyId == companyId)
                .ToListAsync();
        }

        public async Task<CompanyBankDetail> Add(CompanyBankDetail entity)
        {
            await _context.Set<CompanyBankDetail>().AddAsync(entity);
            return entity;
        }

        public Task<CompanyBankDetail> Update(CompanyBankDetail entity)
        {
            _context.Set<CompanyBankDetail>().Update(entity);
            return Task.FromResult(entity);
        }

        public Task<CompanyBankDetail> Delete(CompanyBankDetail entity)
        {
            _context.Set<CompanyBankDetail>().Remove(entity);
            return Task.FromResult(entity);
        }

        public async Task<bool> Exists(Guid id)
        {
            return await _context.Set<CompanyBankDetail>()
                .AnyAsync(x => x.BankDetailId == id);
        }
    }
}
