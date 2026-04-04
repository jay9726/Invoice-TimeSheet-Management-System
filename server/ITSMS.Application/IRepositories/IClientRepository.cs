using ITSMS.Domain.Entities;
using System.Linq.Expressions;

namespace ITSMS.Application.IRepositories
{
    public interface IClientRepository
    {
        Task<int> GetClientCount();
        Task<IReadOnlyList<Client>> GetAll(int? page = null, int? limit = null, string? search = null, Expression<Func<Client, object>>? orderBy = null);

        Task<Client?> GetById(Guid id);
        Task<Client> Add(Client entity);

        Task<Client> Update(Client entity);

        Task<Client> Delete(Client entity);

        Task<bool> Exists(Guid id);

        Task<List<Client>> GetClientAndProjectByCompanyId(Guid compnayId);
    }
}
