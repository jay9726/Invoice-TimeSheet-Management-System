using ITSMS.Domain.Entities.Identity;
using System.Linq.Expressions;

namespace ITSMS.Application.IRepositories
{
    public interface IEmployeeRepository
    {
        Task<int> GetEmployeeCount();
        Task<IReadOnlyList<Employee>> GetAllEmployeeAsync(int? page = null, int? limit = null, string? search = null, Expression<Func<Employee, object>>? orderBy = null);
        Task<Employee?> GetEmployeeByIdAsync(Guid userId);
        Task<Employee> Update(Employee entity);
        Task<Employee> Delete(Employee entity);
        Task<IList<string>> GetRolesByUserIdAsync(Guid userId);
        Task<Dictionary<Guid, IList<string>>> GetRolesByUserIdsAsync(IEnumerable<Guid> userIds);
    }
}
