using ITSMS.Application.DTOs.Report;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Entities.Identity;

namespace ITSMS.Application.IRepositories
{
    public interface IManagerRepository
    {
        Task<List<TimeSheet>> GetTimeSheetByUserIdForManagerAsync(Guid userId);
        Task<TimeSheet> UpdateReviewSheetManager(TimeSheet sheet);
        Task<int> GetEmployeeCountForManager();
        Task<TimeSheet?> GetTimesheetForApprovalAsync(Guid timesheetId, Guid employeeId);
        Task<ApprovalHistory> AddApprovalHistoryAsync(ApprovalHistory history);
        Task<IReadOnlyList<Employee>> GetAllEmployeeForManager(string search);
        Task<EmployeeMonthlyReportDTO?> GetEmployeeMonthlyReportAsync(Guid employeeId, int month, int year);


    }
}
