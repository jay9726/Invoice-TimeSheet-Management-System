using ITSMS.Application.DTOs.TimeEntry;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeEntryController : ControllerBase
    {
        private readonly ITimeEntryService _service;
        public TimeEntryController(ITimeEntryService service) => _service = service;


        /// <summary>
        /// Retrieves a single time entry by its associated task ID, including client name,
        /// project name, task name, work date, hours worked, and billability status.
        /// Accessible by Manager and Employee roles.
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Manager,Employee")]
        [HttpGet("GetTimeEnteryByTaskId")]
        public async Task<IActionResult> GetTimeEntryByTaskId(Guid taskId)
        {
            var result = await _service.GetTimeEntryByTaskId(taskId);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Creates a new time entry for a given employee on a specified work date.
        /// If no timesheet exists for the employee on that date, a new DRAFT timesheet is
        /// automatically created. Adding entries to a SUBMITTED or APPROVED timesheet is not permitted.
        /// A new task activity record is also created and linked to the time entry.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="req"></param>
        /// <param name="employeeId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Employee")]
        [HttpPost]
        public async Task<IActionResult> CreateTimeEntry([FromBody] List<RawCreateTimeEntryRequestDTO> req, Guid employeeId)
        {
            var result = await _service.CreateAsync(employeeId, req);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        /// <summary>
        /// Updates an existing time entry and its associated task activity with the provided data.
        /// Both the time entry fields and the linked task activity name and billability are updated.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="dto"></param>
        /// <param name="timeentryId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Employee")]
        [HttpPut("UpdateTimeEntry")]
        public async Task<IActionResult> UpdateTimeEntry(CreateTimeEntryDTO dto, Guid timeentryId)
        {
            var result = await _service.UpdateTimeEntryAsync(dto, timeentryId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Deletes an existing time entry and its associated task activity by the task ID.
        /// Both the time entry and the linked task activity records are removed.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Employee")]
        [HttpDelete("DeleteTimeEntry")]
        public async Task<IActionResult> DeleteTimeEntry(Guid taskId)
        {
            var result = await _service.DeleteTimeEntryAsync(taskId);
            return result.Success ? Ok(result) : NotFound(result);
        }
    }
}
