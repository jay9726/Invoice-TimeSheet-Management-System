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
    public class TimesheetController : ControllerBase
    {
        private readonly ITimesheetService _service;
        private readonly IEmailTemplate _submitTimesheetEmaill;
        private readonly IEmailService _email;
        private readonly IAuthService _authService;


        public TimesheetController(ITimesheetService service, IEmailTemplate submitTimesheetEmaill, IEmailService email, IAuthService authService)
        {
            _service = service;
            _submitTimesheetEmaill = submitTimesheetEmaill;
            _email = email;
            _authService = authService;
        }


        /// <summary>
        /// Retrieves all timesheets belonging to a specific employee, including the total hours
        /// worked per timesheet calculated by summing its time entries.
        /// Accessible by Manager and Employee roles.
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Manager,Employee")]
        [HttpGet("GetTimesheetByEmployeeId")]
        public async Task<IActionResult> GetTimesheetByEmployeeId(Guid employeeId)
        {
            var res = await _service.GetEmployeeTimesheetsAsync(employeeId);
            return Ok(new { Message = "My timesheets", Data = res });
        }

        /// <summary>
        /// Retrieves all time entries belonging to a specific timesheet, including client name,
        /// project name, task name, work date, hours worked, and billability status.
        /// Accessible by Manager and Employee roles.
        /// Note: the <paramref name="employeeId"/> parameter is accepted but not used by the service layer.
        /// </summary>
        /// <param name="employeeId"></param>
        /// <param name="timesheetId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Manager,Employee")]
        [HttpGet("GetActivityFromTimsSheetId/")]
        public async Task<IActionResult> GetActivityFromTimsSheetId(Guid employeeId, Guid timesheetId)
        {
            var res = await _service.GetTimesheetEntriesAsync(employeeId, timesheetId);
            return Ok(new { Message = "Timesheet entries", Data = res });
        }


        /// <summary>
        /// Retrieves the full approval history for all timesheets belonging to a specific employee,
        /// including status, action taker's name, action date, and comments for each record.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Employee")]
        [HttpGet("GetTimeSheetHistoryByEmployeeId")]
        public async Task<IActionResult> GetTimeSheetHistoryByEmployeeId(Guid id)
        {
            var res = await _service.GetTimeSheetHistoryByEmployeeIDAsync(id);
            return Ok(res);
        }

        /// <summary>
        /// Submits a DRAFT timesheet for manager review by transitioning its status to SUBMITTED.
        /// After submission, retrieves the manager's email via <c>IAuthService</c> and sends a
        /// notification email to the manager using the employee's submission details.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="timesheetId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Employee")]
        [HttpPost("{timesheetId:guid}/SubmitTimeSheetByEmployee")]
        public async Task<IActionResult> SubmitTimeSheetByEmployee(Guid timesheetId)
        {
            var res = await _service.SubmitTimesheetAsync(timesheetId);

            var managerEmail = await _authService.GetManagerEmailAsycn();

            var emailbody = _submitTimesheetEmaill.EmployeeTimesheetSubmittedEmail(res);


            await _email.SendEmailAsync(managerEmail, "TimeSheet Submitted", emailbody);


            return Ok(new { Message = "Timesheet submitted" });
        }

    }
}
