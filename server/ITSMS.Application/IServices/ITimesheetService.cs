using ITSMS.Application.DTOs.Email_Service;
using ITSMS.Application.DTOs.TimeEntry;
using ITSMS.Application.DTOs.TimeSheet;


namespace ITSMS.Application.IServices
{
    public interface ITimesheetService
    {
        Task<List<TimesheetResponseDTO>> GetEmployeeTimesheetsAsync(Guid userId);
        Task<List<TimeEntryResponseDTO>> GetTimesheetEntriesAsync(Guid userId, Guid timesheetId);
        Task<SubmitTimeSheetEmail> SubmitTimesheetAsync(Guid timesheetId);

        Task<List<TimeSheetHistoryDTO>> GetTimeSheetHistoryByEmployeeIDAsync(Guid employeeId);
    }
}
