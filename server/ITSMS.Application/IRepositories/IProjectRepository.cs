using ITSMS.Domain.Entities;
using System.Linq.Expressions;

namespace ITSMS.Application.IRepositories
{
    public interface IProjectRepository
    {
        Task<int> GetProjectCount();

        Task<IReadOnlyList<Project>> GetAll(int? page = null, int? limit = null, string? search = null, Expression<Func<Project, object>>? orderBy = null);

        Task<Project?> GetById(Guid id);

        Task<IReadOnlyList<Project>> GetProjectByClientId(Guid clientId);

        Task<Project> Add(Project entity);

        Task<Project> Update(Project entity);

        Task<Project> Delete(Project entity);

        Task<bool> Exists(Guid id);

    }
}
