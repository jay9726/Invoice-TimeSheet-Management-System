using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ITSMS.Persistence.Repositories
{
    public class ClientsRepository : IClientRepository
    {
        private readonly ITSMSDbContext _context;

        public ClientsRepository(ITSMSDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetClientCount()
        {
            return await _context.Clients.CountAsync();
        }

        public string GetPrimaryKeyName()
        {
            var entityType = _context.Model.FindEntityType(typeof(Client));
            return entityType!.FindPrimaryKey()!.Properties.First().Name;
        }

        public async Task<IReadOnlyList<Client>> GetAll(
     int? page = null,
     int? limit = null,
     string? search = null,
     Expression<Func<Client, object>>? orderBy = null
        )
        {
            var primaryId = GetPrimaryKeyName();

            IQueryable<Client> query = _context.Set<Client>().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                query = query.Where(x =>
                    (x.Companies.CompanyName != null && EF.Functions.Like(x.Companies.CompanyName, $"%{term}%")) ||
                    (x.ClientName != null && EF.Functions.Like(x.ClientName, $"%{term}%")) ||
                    (x.ContactNumber != null && EF.Functions.Like(x.ContactNumber, $"%{term}%")) ||
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
                return await query.Include(x => x.Companies).ToListAsync();
            }

            if (page < 0 || limit < 0)
            {
                throw new ArgumentException("page and limit must be greater than 0.");
            }

            int skip = (page.Value - 1) * limit.Value;

            return await query.Skip(skip).Take(limit.Value).Include(x => x.Companies).ToListAsync();
        }

        public async Task<Client?> GetById(Guid id)
        {
            return await _context.Set<Client>().FindAsync(id);
        }

        public async Task<Client> Add(Client entity)
        {
            await _context.Set<Client>().AddAsync(entity);
            return entity;
        }

        public Task<Client> Update(Client entity)
        {
            _context.Set<Client>().Update(entity);
            return Task.FromResult(entity);
        }

        public Task<Client> Delete(Client entity)
        {
            _context.Set<Client>().Remove(entity);
            return Task.FromResult(entity);
        }

        public async Task<bool> Exists(Guid id)
        {
            return await _context.Set<Client>().AnyAsync(x => x.ClientId == id);
        }


        public async Task<List<Client>> GetClientAndProjectByCompanyId(Guid compnayId)
        {
            return await _context.Clients
                .Where(x => x.CompanyId == compnayId)
                .Include(x => x.Projects)
                .ToListAsync();
        }


    }
}
