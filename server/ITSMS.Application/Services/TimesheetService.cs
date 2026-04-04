using ITSMS.Application.DTOs.Email_Service;
using ITSMS.Application.DTOs.TimeEntry;
using ITSMS.Application.DTOs.TimeSheet;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.Services
{
    public class TimesheetService : ITimesheetService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TimesheetService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves all timesheets belonging to a specific employee, including the total hours
        /// worked per timesheet calculated by summing its time entries.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<TimesheetResponseDTO>> GetEmployeeTimesheetsAsync(Guid userId)
        {
            var sheets = await _unitOfWork.TimesheetRepository.GetTimeSheetByUserIdAsync(userId);
            return sheets.Select(s => new TimesheetResponseDTO
            {
                TimesheetId = s.TimesheetId.ToString(),
                WeekStartDate = s.WeekStartDate,
                Status = s.Status.ToString(),
                TotalHours = s.TimeEntries.Sum(x => x.HoursWorked)
            }).ToList();
        }

        /// <summary>
        /// Retrieves all time entries belonging to a specific timesheet, including client name,
        /// project name, task name, work date, hours worked, and billability status.
        /// Note: the <paramref name="userId"/> parameter is accepted but not used in the current implementation.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="timesheetId"></param>
        /// <returns></returns>

        public async Task<List<TimeEntryResponseDTO>> GetTimesheetEntriesAsync(Guid userId, Guid timesheetId)
        {
            var sheet = await _unitOfWork.TimesheetRepository.GetTimeSheetByIdAsync(timesheetId);

            var entries = await _unitOfWork.TimeEntryRepository.GetByTimesheetIdAsync(timesheetId);
            return entries.Select(e => new TimeEntryResponseDTO
            {
                TimeEntryId = e.TimeEntryId.ToString(),
                TimesheetId = e.TimesheetId.ToString(),
                TaskName = e.TaskActivities.TaskName,
                ClientName = e.Clients.ClientName,
                ProjectName = e.Projects.ProjectName,
                StartTime = e.StartTime.ToString(),
                EndTime = e.EndTime.ToString(),
                WorkDate = e.WorkDate,
                HoursWorked = e.HoursWorked.ToString(),
                IsBillable = e.IsBillable,
                Notes = e.Notes

            }).ToList();
        }


        /// <summary>
        /// Submits a timesheet for manager review by updating its status to <see cref="TimeSheetStatus.SUBMITTED"/>
        /// and recording the submission timestamp. After saving, fetches the employee record associated with
        /// the timesheet and returns the data needed to send a submission notification email.
        /// Throws an <see cref="Exception"/> if the timesheet is not found.
        /// </summary>
        /// <param name="timesheetId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<SubmitTimeSheetEmail> SubmitTimesheetAsync(Guid timesheetId)
        {
            var sheet = await _unitOfWork.TimesheetRepository.GetTimeSheetByIdAsync(timesheetId);
            if (sheet == null) throw new Exception("Timesheet not found");

            sheet.Status = TimeSheetStatus.SUBMITTED;
            sheet.SubmittedOn = DateTime.UtcNow;

            await _unitOfWork.Save();

            var employee = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(sheet.UserId ?? Guid.Empty);

            return new SubmitTimeSheetEmail
            {
                EmployeeName = employee.FullName ?? "",
                SubmittedDate = sheet.SubmittedOn,
                EmployeeEmail = employee.Email
            };


        }


        /// <summary>
        /// Retrieves the full approval history for all timesheets belonging to a specific employee.
        /// For each timesheet, fetches the name of the manager or user who took the approval action,
        /// using a null-safe lookup in case the approver record is not found.
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns></returns>

        public async Task<List<TimeSheetHistoryDTO>> GetTimeSheetHistoryByEmployeeIDAsync(Guid employeeId)
        {
            var timeSheets = await _unitOfWork.TimesheetRepository.GetTimeSheetHistoryByEmployeeIdAsync(employeeId);

            List<TimeSheetHistoryDTO> timeSheetHistory = new List<TimeSheetHistoryDTO>();

            foreach (var t in timeSheets)
            {
                var actionUser = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(t.ApprovedBy ?? Guid.Empty);

                timeSheetHistory.Add(new TimeSheetHistoryDTO
                {
                    TimesheetDate = t.WeekStartDate.ToString(),
                    Status = t.Status.ToString(),
                    ActionBy = actionUser?.FullName,   
                    ActionDate = t.ApprovedOn.ToString(),
                    Comment = t.Comments,
                    Remarks = t.Comments,
                });
            }

            return timeSheetHistory; 
        }

    }
}
