using ITSMS.Application.DTOs.Client;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientsService _clientsService;

        public ClientsController(IClientsService clientsService)
        {
            _clientsService = clientsService;
        }

        /// <summary>
        /// Returns the total number of clients in the system.
        /// Accessible by Admin, AccountUser, and Manager roles.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager")]
        [HttpGet("GetClientCount")]
        public async Task<IActionResult> GetTotalClient()
        {
            int res = await _clientsService.GetClientCount();
            return Ok(res);
        }


        /// <summary>
        /// Retrieves a paginated list of all clients with their associated company details.
        /// Accessible by Admin, AccountUser, Manager, and Employee roles.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager,Employee")]
        [HttpGet("GetAllClients")]
        public async Task<IActionResult> GetClients([FromQuery] int? page = 0, [FromQuery] int? limit = 0, [FromQuery] string? search=null)
        {
            var result = await _clientsService.GetAllClients(page, limit, search);
            return Ok(result);
        }


        /// <summary>
        /// Retrieves a single client by their unique identifier.
        /// Accessible by Admin, AccountUser, Manager, and Employee roles.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager,Employee")]
        [HttpGet("GetClientById/{id:guid}")]
        public async Task<IActionResult> GetClientById(Guid id)
        {
            var result = await _clientsService.GetClientById(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Retrieves all projects associated with a specific client.
        /// Accessible by Admin, AccountUser, Manager, and Employee roles.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager,Employee")]
        [HttpGet("GetProjectsByClientId/{clientId:guid}")]
        public async Task<IActionResult> GetProjectsByClientId(Guid clientId)
        {
            var result = await _clientsService.GetProjectsByClientId(clientId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Retrieves all clients belonging to a specific company, each including their associated list of projects.
        /// Accessible by Admin, AccountUser, Manager, and Employee roles.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser,Manager,Employee")]
        [HttpGet("clients-projects")]
        public async Task<IActionResult> GetClientsAndProjects(Guid companyId)
        {
            var result = await _clientsService.GetClientsWithProjectsByCompanyIdAsync(companyId);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Creates a new client record from the provided data.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost("CreateClient")]
        public async Task<IActionResult> CreateClient([FromBody] ClientDTO dto)
        {
            var result = await _clientsService.CreateClient(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>
        /// Updates an existing client record with the provided data.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateClient/{id:guid}")]
        public async Task<IActionResult> UpdateClient(Guid id, [FromBody] ClientDTO dto)
        {
            var result = await _clientsService.UpdateClient(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Activates or deactivates a client by updating their active status.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateClientStatus/{id:guid}")]
        public async Task<IActionResult> GetClientstatus(Guid id, [FromQuery] bool status)
        {
            var result = await _clientsService.UpdateClientStatus(id, status);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Deletes an existing client record by their unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteClient/{id:guid}")]
        public async Task<IActionResult> DeleteClient(Guid id)
        {
            var result = await _clientsService.DeleteClient(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

    }
}
