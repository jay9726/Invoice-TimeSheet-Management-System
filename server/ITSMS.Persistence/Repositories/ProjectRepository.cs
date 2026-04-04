using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ITSMS.Persistence.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ITSMSDbContext _context;

        public ProjectRepository(ITSMSDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetProjectCount()
        {
            return await _context.Projects.CountAsync();
        }

        public string GetPrimaryKeyName()
        {
            var entityType = _context.Model.FindEntityType(typeof(Project));
            return entityType!.FindPrimaryKey()!.Properties.First().Name;
        }

        public async Task<IReadOnlyList<Project>> GetAll(
     int? page = null,
     int? limit = null,
     string? search = null,
     Expression<Func<Project, object>>? orderBy = null
        )
        {
            var primaryId = GetPrimaryKeyName();

            IQueryable<Project> query = _context.Set<Project>()
                .AsNoTracking()
                .Include(x => x.Client);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                query = query.Where(x =>
                    (x.Client.ClientName != null && EF.Functions.Like(x.Client.ClientName, $"%{term}%")) ||
                    (x.ProjectName != null && EF.Functions.Like(x.ProjectName, $"%{term}%")) ||
                    (x.HourlyRate != null && EF.Functions.Like(x.HourlyRate.ToString(), $"%{term}%"))
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
        

        public async Task<Project?> GetById(Guid id)
        {
            return await _context.Set<Project>()
                .Include(x => x.Client)
                .FirstOrDefaultAsync(x => x.ProjectId == id);
        }

        public async Task<IReadOnlyList<Project>> GetProjectByClientId(Guid clientId)
        {
            return await _context.Projects
                .AsNoTracking()
                .Include(x => x.Client)
                .Where(x => x.ClientId == clientId)
                .ToListAsync();
        }

        public async Task<Project> Add(Project entity)
        {
            await _context.Set<Project>().AddAsync(entity);
            return entity;
        }

        public Task<Project> Update(Project entity)
        {
            _context.Set<Project>().Update(entity);
            return Task.FromResult(entity);
        }

        public Task<Project> Delete(Project entity)
        {
            _context.Set<Project>().Remove(entity);
            return Task.FromResult(entity);
        }

        public async Task<bool> Exists(Guid id)
        {
            return await _context.Set<Project>().AnyAsync(x => x.ProjectId == id);
        }
    }
}
