using ITSMS.Domain.Entities;
using System.Linq.Expressions;

namespace ITSMS.Application.IRepositories
{
    public interface ICompanyBankDetailRepository
    {
        Task<IReadOnlyList<CompanyBankDetail>> GetAll(int? page = null, int? limit = null, string? search = null, Expression<Func<CompanyBankDetail, object>>? orderBy = null);

        Task<int> GetBankDetailsCount();
        Task<CompanyBankDetail?> GetById(Guid id);
        Task<IReadOnlyList<CompanyBankDetail>> GetBankDetailByCompanyId(Guid companyId);

        Task<CompanyBankDetail> Add(CompanyBankDetail entity);

        Task<CompanyBankDetail> Update(CompanyBankDetail entity);

        Task<CompanyBankDetail> Delete(CompanyBankDetail entity);

        Task<bool> Exists(Guid id);

    }
}
