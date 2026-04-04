using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.CompanyBankDetail;

namespace ITSMS.Application.IServices
{
    public interface ICompanyBankDetailService
    {
        Task<int> GetBankDetailsCount();

        Task<APIResponse<List<GetCompanyBankDetailsDTO>>> GetAllBankDetails(int? page, int? limit, string? search);

        Task<APIResponse<GetCompanyBankDetailsDTO>> GetBankDetailById(Guid id);

        Task<APIResponse<CompanyBankDetailDTO>> CreateBankDetail(CompanyBankDetailDTO dto);

        Task<APIResponse<CompanyBankDetailDTO>> UpdateBankDetail(Guid id, CompanyBankDetailDTO dto);

        Task<APIResponse<Guid>> DeleteBankDetail(Guid id);
        Task<APIResponse<bool>> UpdateBankDetailStatus(Guid id, bool status);

    }
}
