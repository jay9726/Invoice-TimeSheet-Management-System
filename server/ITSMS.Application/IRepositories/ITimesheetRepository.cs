using ITSMS.Domain.Entities;

namespace ITSMS.Application.IRepositories
{
    public interface ITimesheetRepository
    {
        Task<TimeSheet?> CheckandGetTimeSheetByUserAndDateAsync(Guid userId, DateOnly date);
        Task<List<TimeSheet>> GetTimeSheetByUserIdAsync(Guid userId);
        Task<TimeSheet?> GetTimeSheetByIdAsync(Guid timesheetId);
        Task AddTimeSheetAsync(TimeSheet timesheet);
        Task SaveChangesAsync();

        Task<List<TimeSheet>> GetTimeSheetHistoryByEmployeeIdAsync(Guid employeeId);
    }
}
