using ITSMS.Application.IServices;
using ITSMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]   
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Retrieves a paginated list of companies available for invoice generation.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [HttpGet("AdminCompaniesForInvoice")]
        public async Task<IActionResult> GetAdminCompanies([FromQuery] int? page = 0, int? limit = 0, string? search = null)
        {
            var result = await _adminService.GetAdminCompaniesForInvoiceAsync(page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Retrieves all invoices associated with a specific client company, with optional search filtering.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [HttpGet("AdminClientInvoice")]
        public async Task<IActionResult> GetAdminClientInvoice([FromQuery] Guid companyId, [FromQuery] string? search)
        {
            var result = await _adminService.GetAdminClientInvoice(companyId, search);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Applies an approval decision to an invoice by updating its status (e.g. approved or rejected).
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        [HttpPost("InvoiceDecision")]
        public async Task<IActionResult> InvoiceDecision([FromQuery] Guid invoiceId, [FromQuery] InvoiceStatus status)
        {
            var result = await _adminService.InvoiceDecision(invoiceId, status);
            return result.Success ? Ok(result) : NotFound(result);

        }


    }
}
