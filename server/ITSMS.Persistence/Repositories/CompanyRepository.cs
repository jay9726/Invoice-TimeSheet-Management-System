using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ITSMS.Persistence.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ITSMSDbContext _context;

        public CompanyRepository(ITSMSDbContext context)
        {
            _context = context;

        }

        public async Task<int> GetCompanyCount()
        {
            return await _context.Companies.CountAsync();
        }

        public string GetPrimaryKeyName()
        {
            var entityType = _context.Model.FindEntityType(typeof(Company));
            return entityType.FindPrimaryKey().Properties.First().Name;
        }


        public async Task<IReadOnlyList<Company>> GetAll(
     int? page = null,
     int? limit = null,
     string? search = null,
     Expression<Func<Company, object>>? orderBy = null
 )
        {
            var primaryId = GetPrimaryKeyName();

            IQueryable<Company> query = _context.Set<Company>().AsNoTracking();

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
                query = query.OrderByDescending(x => EF.Property<object>(x, primaryId));
            }

            if (!isPaging)
            {
                return await query.OrderBy(x => EF.Property<object>(x, nameof(x.CompanyName))).ToListAsync();
            }

            
            if (page < 0 || limit < 0)
            {
                throw new ArgumentException("page and limit must be greater than 0.");
            }

            int skip = (page!.Value - 1) * limit!.Value;

            return await query.Skip(skip).Take(limit.Value).ToListAsync();
        }


        public async Task<Company?> GetById(Guid id)
        {
            return await _context.Set<Company>().FindAsync(id);
        }


        public async Task<Company> Add(Company entity)
        {
            await _context.Set<Company>().AddAsync(entity);
            return entity;
        }


        public Task<Company> Update(Company entity)
        {
            _context.Set<Company>().Update(entity);
            return Task.FromResult(entity);
        }


        public Task<Company> Delete(Company entity)
        {
            _context.Set<Company>().Remove(entity);
            return Task.FromResult(entity);
        }


        public async Task<bool> Exists(Guid id)
        {
            var entity = await _context.Set<Company>().FindAsync(id);
            return entity != null;
        }
    }
}
