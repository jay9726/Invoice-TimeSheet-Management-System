using ITSMS.Domain.Entities;
using System.Linq.Expressions;

namespace ITSMS.Application.IRepositories
{
    public interface ICompanyRepository
    {
        Task<int> GetCompanyCount();
        string GetPrimaryKeyName();
        Task<IReadOnlyList<Company>> GetAll(int? page = null, int? limit = null, string? search = null, Expression<Func<Company, object>>? orderBy = null);
        Task<Company?> GetById(Guid id);
        Task<Company> Add(Company entity);
        Task<Company> Update(Company entity);
        Task<Company> Delete(Company entity);
        Task<bool> Exists(Guid id);
    }
}
