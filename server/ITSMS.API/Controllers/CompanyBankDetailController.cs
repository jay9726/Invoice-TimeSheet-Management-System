using ITSMS.Application.DTOs.CompanyBankDetail;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyBankDetailController : ControllerBase
    {
        private readonly ICompanyBankDetailService _service;

        public CompanyBankDetailController(ICompanyBankDetailService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns the total number of company bank detail records in the system.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("GetCompanyBankDetailsCount")]
        public async Task<IActionResult> GetTotalCompanyBankDetails()
        {
            int count = await _service.GetBankDetailsCount();
            return Ok(count);
        }

        /// <summary>
        /// Retrieves a paginated list of all company bank details.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllBankDetails")]
        public async Task<IActionResult> GetAllBankDetails([FromQuery] int? page = 0, [FromQuery] int? limit = 0, [FromQuery] string? search = null)
        {
            var result = await _service.GetAllBankDetails(page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);

        }

        /// <summary>
        /// Retrieves a single company bank detail record by its unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("GetBankDetailById/{id:guid}")]
        public async Task<IActionResult> GetBankDetailById(Guid id)
        {
            var result = await _service.GetBankDetailById(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Creates a new company bank detail record from the provided data.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost("CreateBankDetail")]
        public async Task<IActionResult> CreateBankDetail([FromBody] CompanyBankDetailDTO dto)
        {
            var result = await _service.CreateBankDetail(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>
        /// Activates or deactivates a company bank detail record by updating its active status.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateBankDetailStatus/{id:guid}")]
        public async Task<IActionResult> GetBankDetailStatus(Guid id, [FromQuery] bool status)
        {
            var result = await _service.UpdateBankDetailStatus(id, status);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Updates an existing company bank detail record with the provided data.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateBankDetail/{id:guid}")]
        public async Task<IActionResult> UpdateBankDetail(Guid id, [FromBody] CompanyBankDetailDTO dto)
        {
            var result = await _service.UpdateBankDetail(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Deletes an existing company bank detail record by its unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteBankDetail/{id:guid}")]
        public async Task<IActionResult> DeleteBankDetail(Guid id)
        {
            var result = await _service.DeleteBankDetail(id);
            return result.Success ? Ok(result) : NotFound(result);
        }
    }
}
