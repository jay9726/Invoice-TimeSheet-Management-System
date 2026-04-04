using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }


        /// <summary>
        /// Returns the total number of employee records in the system.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpGet("GetEmployeeCount")]
        public async Task<IActionResult> GetTotalEmployee()
        {
            int res = await _employeeService.GetEmployeeCount();
            return Ok(res);
        }


        /// <summary>
        /// Retrieves a paginated list of all employees along with their assigned roles.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllEmployee")]
        public async Task<IActionResult> GetAllEmployees([FromQuery] int page = 0, [FromQuery] int limit = 0, [FromQuery] string search = null)
        {
            var result = await _employeeService.GetAllEmployeeAsync(page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Retrieves a single employee by their unique identifier, including their assigned role.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("GetEmployeeById/{id:guid}")]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            var result = await _employeeService.GetEmployeeByIdAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Activates or deactivates an employee by updating their active status.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateEmployeeStatus/{id:guid}")]
        public async Task<IActionResult> GetEmployeeStatus(Guid id, [FromQuery] bool status)
        {
            var result = await _employeeService.UpdateEmployeeStatus(id, status);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Updates an existing employee's profile and role assignment.
        /// If a new role is provided in the request body, all current roles are removed and replaced.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateEmployee/{id:guid}")]
        public async Task<IActionResult> UpdateEmployee(Guid id, [FromBody] UpdateEmployeeDTO dto)
        {
            var result = await _employeeService.UpdateEmployee(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Deletes an existing employee record by their unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteEmployee/{id:guid}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var result = await _employeeService.DeleteEmployee(id);
            return result.Success ? Ok(result) : NotFound(result);
        }


    }
}
