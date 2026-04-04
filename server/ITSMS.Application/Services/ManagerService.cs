using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Email_Service;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.DTOs.Report;
using ITSMS.Application.DTOs.TimeSheet;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.Services
{
    public class ManagerService : IManagerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ManagerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves all submitted timesheets for a specific employee, including the total hours
        /// worked per timesheet calculated by summing its time entries.
        /// Returns an empty list response if no submitted timesheets are found.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<APIResponse<List<TimesheetResponseDTO>>> GetSubmittedTimeSheet(Guid userId)
        {
            if (userId == Guid.Empty)
                return APIResponse<List<TimesheetResponseDTO>>.Fail("Invalid employee ID");

            var sheets = await _unitOfWork.ManagerRepository.GetTimeSheetByUserIdForManagerAsync(userId);

            if (sheets == null || !sheets.Any())
                return APIResponse<List<TimesheetResponseDTO>>.Ok([],"No submitted timesheets found");

            var result = sheets.Select(s => new TimesheetResponseDTO
            {
                TimesheetId = s.TimesheetId.ToString(),
                WeekStartDate = s.WeekStartDate,
                Status = s.Status.ToString(),
                TotalHours = s.TimeEntries.Sum(x => x.HoursWorked)
            }).ToList();

            return APIResponse<List<TimesheetResponseDTO>>.Ok(result, "Timesheets fetched successfully");
        }


        /// <summary>
        /// Processes an approval or rejection action on a timesheet submitted by an employee.
        /// Parses the action string into a <see cref="TimeSheetStatus"/> enum value, updates the timesheet's
        /// status, approval metadata, and comment, and records the decision in the approval history.
        /// Returns a <see cref="DecisionTimeSheetEmail"/> DTO with the data needed to notify the employee
        /// by email about the outcome.
        /// </summary>
        /// <param name="managerId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<APIResponse<DecisionTimeSheetEmail>> TakeTimesheetActionAsync(Guid managerId, TimesheetApprovalRequestDTO request)
        {
            if (managerId == Guid.Empty || request == null)
                return APIResponse<DecisionTimeSheetEmail>.Fail("Invalid request data");

            var timesheet = await _unitOfWork.ManagerRepository.GetTimesheetForApprovalAsync(request.TimesheetId, request.EmployeeId);
            if (timesheet == null)
                return APIResponse<DecisionTimeSheetEmail>.Fail("Timesheet not found for this employee");

            if (!Enum.TryParse<TimeSheetStatus>(request.Action, true, out var status))
                return APIResponse<DecisionTimeSheetEmail>.Fail("Invalid action value");

            timesheet.Status = status;
            timesheet.ApprovedOn = DateTime.UtcNow;
            timesheet.ApprovedBy = managerId;
            timesheet.Comments = request.Comment;

            var history = new ApprovalHistory
            {
                TimesheetId = timesheet.TimesheetId,
                Action = status,
                ActionBy = managerId,
                ActionDate = DateTime.UtcNow,
                Remarks = request.Comment
            };

            await _unitOfWork.ManagerRepository.AddApprovalHistoryAsync(history);

            var actionBy = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(managerId);
            var employee = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(timesheet.UserId ?? Guid.Empty);

            if (actionBy == null)
                return APIResponse<DecisionTimeSheetEmail>.Fail("Manager not found");

            if (employee == null)
                return APIResponse<DecisionTimeSheetEmail>.Fail("Employee not found");

            var result = new DecisionTimeSheetEmail
            {
                TimeSheetName = timesheet.WeekStartDate.ToString(),
                Status = timesheet.Status.ToString(),
                ActionDate = timesheet.ApprovedOn,
                ActionBy = actionBy.FullName ?? "",
                EmployeeName = employee.FullName ?? "",
                EmployeeEmail = employee.Email,
                ManagerComment = request.Comment
            };

            return APIResponse<DecisionTimeSheetEmail>.Ok(result, "Timesheet action taken successfully");
        }


        /// <summary>
        /// Retrieves all employees visible to the manager, with an optional search filter.
        /// Also fetches the total employee count managed and includes it in the response.
        /// Note: role information is not included in the returned DTO for this manager-scoped listing.
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetEmployeeDTO>>> GetAllEmployeeForManager(string search)
        {
              var employees = await _unitOfWork.ManagerRepository.GetAllEmployeeForManager(search);

            if (employees == null || !employees.Any())
                return APIResponse<List<GetEmployeeDTO>>.Fail("No employees found");

            int count = await _unitOfWork.ManagerRepository.GetEmployeeCountForManager();

            var result = employees.Select(x => new GetEmployeeDTO
            {
                EmployeeId = x.Id.ToString(),
                Email      = x.Email,
                FullName   = x.FullName,
                IsActive   = x.IsActive
            }).ToList();

            return APIResponse<List<GetEmployeeDTO>>.Ok(result, "Employees fetched successfully", count);
        }

        /// <summary>
        /// Generates a monthly timesheet report for a specific employee for a given month and year.
        /// Validates that the employee ID is a valid <see cref="Guid"/>, and that the month value is between 1 and 12.
        /// Defaults to the current UTC year if no year is provided in the request.
        /// Returns a success response with the report data and an informational message if no entries exist for the period.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        public async Task<APIResponse<EmployeeMonthlyReportDTO>> GetEmployeeMonthlyReportAsync(EmployeeMonthlyReportRequestDTO request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.EmployeeId))
                return APIResponse<EmployeeMonthlyReportDTO>.Fail("Invalid request data");

            if (request.Month < 1 || request.Month > 12)
                return APIResponse<EmployeeMonthlyReportDTO>.Fail("Month must be between 1 and 12");

            if (!Guid.TryParse(request.EmployeeId, out var employeeGuid))
                return APIResponse<EmployeeMonthlyReportDTO>.Fail("Invalid employee ID format");

            int year = request.Year ?? DateTime.UtcNow.Year;
            var report = await _unitOfWork.ManagerRepository.GetEmployeeMonthlyReportAsync(employeeGuid, request.Month, year);

            if (report == null)
                return APIResponse<EmployeeMonthlyReportDTO>.Fail("Employee not found");

            if (report.Items == null || report.Items.Count == 0)
                return APIResponse<EmployeeMonthlyReportDTO>.Ok(report, "No timesheet entries found for this period");

            return APIResponse<EmployeeMonthlyReportDTO>.Ok(report, "Employee monthly report generated successfully");
        }

    }
}
