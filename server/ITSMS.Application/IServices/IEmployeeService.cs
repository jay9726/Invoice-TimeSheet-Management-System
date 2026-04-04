using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Employee;

namespace ITSMS.Application.IServices
{
    public interface IEmployeeService
    {
        Task<int> GetEmployeeCount();
        Task<APIResponse<List<GetEmployeeDTO>>> GetAllEmployeeAsync(int? page, int? limit, string? search);
        Task<APIResponse<GetEmployeeDTO>> GetEmployeeByIdAsync(Guid userId);
        Task<APIResponse<GetEmployeeDTO>> UpdateEmployee(Guid id, UpdateEmployeeDTO dto);
        Task<APIResponse<Guid>> DeleteEmployee(Guid id);
        Task<APIResponse<bool>> UpdateEmployeeStatus(Guid id, bool status);

    }
}
