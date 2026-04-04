using ITSMS.Application.DTOs.Email_Service;
using ITSMS.Application.DTOs.Report;
using ITSMS.Application.DTOs.TimeSheet;
using ITSMS.Application.IServices;
using ITSMS.Authentication.JWT.EmailService;
using ITSMS.Authentication.JWT.Services;
using ITSMS.Authentication.JWT.Template;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;
        private readonly IEmailTemplate _desicionTimesheetEmail;
        private readonly IEmailService _email;
        private readonly IAuthService _authService;

        public ManagerController(IManagerService managerService, IEmailTemplate emailTemplate, IEmailService email, IAuthService authService)
        {
            _managerService = managerService;
            _desicionTimesheetEmail = emailTemplate;
            _email = email;
            _authService = authService;
        }


        /// <summary>
        /// Retrieves all employees visible to the manager, with an optional search filter.
        /// Restricted to users with the Manager role.
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "Manager")]
        [HttpGet("EmployeeForManager")]
        public async Task<IActionResult> GetEmployeeForManager([FromQuery] string? search = null)
        {
            var result = await _managerService.GetAllEmployeeForManager(search);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Retrieves all submitted timesheets for a specific employee, including the total hours
        /// worked per timesheet.
        /// Restricted to users with the Manager role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Manager")]
        [HttpGet("GetSubmittedSheetByEmployeeId")]
        public async Task<IActionResult> GetSubmittedTimeSheetByEmployeeId(Guid id)
        {
            var result = await _managerService.GetSubmittedTimeSheet(id);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Generates a monthly timesheet report for a specific employee for a given month and year.
        /// Restricted to users with the Manager role.
        /// Note: the service is currently called twice in this action; the second call result is
        /// used for the null check while the first call result is returned in the response.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        [Authorize(Roles = "Manager")]
        [HttpPost("employee-monthly")]
        public async Task<IActionResult> GetEmployeeMonthly([FromBody] EmployeeMonthlyReportRequestDTO request)
        {

            var result = await _managerService.GetEmployeeMonthlyReportAsync(request);

            var report = await _managerService.GetEmployeeMonthlyReportAsync(request);

            if (report == null)
                return NotFound(new { Message = "Employee not found." });

            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>
        /// Processes an approval or rejection action on a submitted timesheet and dispatches
        /// notification emails based on the outcome.
        /// If the timesheet is APPROVED, an approval email is sent to the employee and a separate
        /// notification is sent to the AccountUser retrieved via <c>IAuthService</c>.
        /// If the timesheet is REJECTED, a rejection email is sent to the employee only.
        /// Restricted to users with the Manager role.
        /// </summary>
        /// <param name="managerId"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize(Roles = "Manager")]
        [HttpPut("TimeSheetApprovManager")]
        public async Task<IActionResult> TakeTimesheetActionAsync(Guid managerId, TimesheetApprovalRequestDTO dto)
        {
            var result = await _managerService.TakeTimesheetActionAsync(managerId, dto);

            if (!result.Success)
                return NotFound(result);

            var res = result.Data!;

            if (res.Status == "APPROVED")
            {
                var emailbody = _desicionTimesheetEmail.ApprovedTimeSheetEmail(res);

                await _email.SendEmailAsync(res.EmployeeEmail!, "TimeSheet Approved", emailbody);


                var emaildto = new AccountUserApprovedEmail
                {
                    ApprovedDate = res.ActionDate,
                    ManagerName = res.ActionBy,
                    TimesheetName = res.TimeSheetName,
                    UserName = res.EmployeeName
                };

                var accountUserEmail = await _authService.GetAccountUserEmailAsycn();

                var accountuserEmailBody = _desicionTimesheetEmail.AccountUserApprovedTimeSheetEmail(emaildto);

                await _email.SendEmailAsync(accountUserEmail, $"TimeSheet Approved By {res.ActionBy}", accountuserEmailBody);
            }

            if (res.Status == "REJECTED")
            {
                var emailbody = _desicionTimesheetEmail.RejectedTimeSheetEmail(res);

                await _email.SendEmailAsync(res.EmployeeEmail!, "TimeSheet Rejected", emailbody);
            }


            return Ok(result);
        }

    }
}
