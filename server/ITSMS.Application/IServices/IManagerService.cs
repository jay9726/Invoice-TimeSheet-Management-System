using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Email_Service;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.DTOs.Report;
using ITSMS.Application.DTOs.TimeSheet;

namespace ITSMS.Application.IServices
{
    public interface IManagerService
    {
        Task<APIResponse<List<TimesheetResponseDTO>>> GetSubmittedTimeSheet(Guid userId);

        Task<APIResponse<DecisionTimeSheetEmail>> TakeTimesheetActionAsync(Guid managerId, TimesheetApprovalRequestDTO request);

        Task<APIResponse<List<GetEmployeeDTO>>> GetAllEmployeeForManager(string search);

        Task<APIResponse<EmployeeMonthlyReportDTO>> GetEmployeeMonthlyReportAsync(EmployeeMonthlyReportRequestDTO request);


    }
}
