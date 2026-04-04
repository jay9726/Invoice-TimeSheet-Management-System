using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Company;

namespace ITSMS.Application.IServices
{
    public interface ICompanyService
    {
        Task<int> GetCompanyCount();

        Task<APIResponse<List<GetCompanyDTO>>> GetAllCompanies(int? page, int? limit, string? search);
        Task<APIResponse<GetCompanyDTO>> GetById(Guid id);
        Task<APIResponse<GetCompanyDTO>> AddCompany(CompanyDTO entity);
        Task<APIResponse<GetCompanyDTO>> UpdateCompany(Guid id, CompanyDTO dto);
        Task<APIResponse<Guid>> DeleteCompany(Guid id);
        Task<APIResponse<bool>> UpdateCompanyStatus(Guid id, bool status);
        Task<APIResponse<List<GetBankDetailByCompanyIdDTO>>> GetBankDetailByCompanyId(Guid companyId);

    }
}
