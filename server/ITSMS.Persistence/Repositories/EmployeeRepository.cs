using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities.Identity;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;


namespace ITSMS.Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ITSMSDbContext _db;
        private readonly UserManager<Employee> _userManager;
        public EmployeeRepository(ITSMSDbContext db, UserManager<Employee> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        public async Task<int> GetEmployeeCount()
        {
            return await _db.Users.CountAsync();
        }

        public string GetPrimaryKeyName()
        {
            var entityType = _db.Model.FindEntityType(typeof(Employee));
            return entityType!.FindPrimaryKey()!.Properties.First().Name;
        }


        public async Task<IReadOnlyList<Employee>> GetAllEmployeeAsync(int? page = null, int? limit = null, string? search= null, Expression<Func<Employee, object>>? orderBy = null)
        {

            var primaryId = GetPrimaryKeyName();

            IQueryable<Employee> query = _db.Set<Employee>().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                query = query.Where(x =>
                    (x.FullName != null && EF.Functions.Like(x.FullName, $"%{term}%")) ||
                    (x.Email != null && EF.Functions.Like(x.Email, $"%{term}%")) 
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

        public async Task<Employee?> GetEmployeeByIdAsync(Guid userId) { return await _db.Users.FirstOrDefaultAsync(x => x.Id == userId); }

        public async Task<Employee> Update(Employee entity)
        {
            _db.Set<Employee>().Update(entity);
            return entity;
        }

        public async Task<Employee> Delete(Employee entity)
        {
            _db.Set<Employee>().Remove(entity);
            return entity;
        }

        public async Task<IList<string>> GetRolesByUserIdAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return new List<string>();

            return await _userManager.GetRolesAsync(user);
        }





        public async Task<Dictionary<Guid, IList<string>>> GetRolesByUserIdsAsync(IEnumerable<Guid> userIds)
        {
            var result = new Dictionary<Guid, IList<string>>();

            var userRoles = await _db.UserRoles
                .Where(ur => userIds.Contains(ur.UserId))
                .Join(_db.Roles,
                      ur => ur.RoleId,
                      r => r.Id,
                      (ur, r) => new { ur.UserId, r.Name })
                .ToListAsync();

            foreach (var userId in userIds)
            {
                result[userId] = userRoles
                    .Where(x => x.UserId == userId)
                    .Select(x => x.Name ?? "")
                    .ToList();
            }

            return result;
        }


    }
}
