using ITSMS.Application.DTOs.Project;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// Returns the total number of project records in the system.
        /// Accessible by Admin, AccountUser, Manager, and Employee roles.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager,Employee")]
        [HttpGet("GetProjectCount")]
        public async Task<IActionResult> GetTotalProject()
        {
            int res = await _projectService.GetProjectCount();
            return Ok(res);
        }


        /// <summary>
        /// Retrieves a paginated list of all projects, including their associated client names and hourly rates.
        /// Accessible by Admin and Employee roles.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("GetAllProjects")]
        public async Task<IActionResult> GetAllProjects([FromQuery] int page = 0, [FromQuery] int limit = 0, [FromQuery] string? search = null)
        {
            var result = await _projectService.GetAllProjects(page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Retrieves a single project by its unique identifier, including client name,
        /// hourly rate, and payment terms.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("GetProjectById/{id:guid}")]
        public async Task<IActionResult> GetProjectById(Guid id)
        {
            var result = await _projectService.GetProjectById(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Creates a new project record from the provided data.
        /// Note: client name is not included in the returned DTO as the navigation
        /// property is not loaded after creation.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDTO dto)
        {
            var result = await _projectService.CreateProject(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        /// <summary>
        /// Activates or deactivates a project by updating its active status.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateProjectStatus/{id:guid}")]
        public async Task<IActionResult> GetProjectStatus(Guid id, [FromQuery] bool status)
        {
            var result = await _projectService.UpdateProjectStatus(id, status);
            return result.Success ? Ok(result) : NotFound(result);

        }

        /// <summary>
        /// Updates an existing project record with the provided data.
        /// Client name is included in the returned DTO only if the navigation property
        /// is available on the updated entity.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateProject/{id:guid}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromBody] ProjectDTO dto)
        {
            var result = await _projectService.UpdateProject(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Deletes an existing project record by its unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteProject/{id:guid}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var result = await _projectService.DeleteProject(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

    }
}
