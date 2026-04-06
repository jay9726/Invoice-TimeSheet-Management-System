using ITSMS.Application.DTOs.Invoice;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _service;

        public InvoiceController(IInvoiceService service)
        {
            _service = service;
        }
        /// <summary>
        /// Retrieves all companies available for invoicing, each enriched with their associated client count.
        /// Restricted to users with the AccountUser role.
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "AccountUser")]
        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies([FromQuery] string? search = null)
        {
            var result = await _service.GetCompaniesAsync(search);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Retrieves a paginated list of clients belonging to a specific company,
        /// each including their most recent invoice status.
        /// Restricted to users with the AccountUser role.
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        [Authorize(Roles = "AccountUser")]
        [HttpGet("companies/{companyId:guid}/clients")]
        public async Task<IActionResult> GetClientsByCompanyId([FromRoute] Guid companyId, [FromQuery] int page = 0, [FromQuery] int limit = 0, [FromQuery] string? search = null)
        {
            var result = await _service.GetClientsByCompanyIdAsync(companyId, page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Generates a full invoice preview for a given client by aggregating time entry data
        /// across their projects, including company info, billing address, bank details, and line items.
        /// Accessible by Admin and AccountUser roles.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,AccountUser")]
        [HttpGet("preview")]
        public async Task<IActionResult> Preview([FromQuery] Guid invoiceId)
        {
            var result = await _service.GetInvoicePreviewAsync(invoiceId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Generates or updates a DRAFT invoice for a given client based on current time entry data.
        /// If no invoice exists, a new one is created with auto-generated invoice and PO numbers.
        /// If an invoice already exists, new project line items are appended, existing ones are updated,
        /// and the total is recalculated.
        /// Restricted to users with the AccountUser role.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="clientId"></param>
        /// <returns></returns>

        [Authorize(Roles = "AccountUser")]
        [HttpPost("GenerateInvoice")]
        public async Task<IActionResult> GenerateInvoice([FromQuery] Guid userId, Guid clientId)
        {
            var result = await _service.GenerateInvoiceAsync(userId, clientId);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        /// <summary>
        /// Submits a DRAFT invoice for manager review by transitioning its status to SUBMITTED.
        /// Restricted to users with the AccountUser role.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <returns></returns>

        [Authorize(Roles = "AccountUser")]
        [HttpPost("SubmitInvoice")]
        public async Task<IActionResult> SubmitInvoice([FromQuery] Guid invoiceId)
        {
            var result = await _service.SubmitInvoiceAsync(invoiceId);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Updates the status of an invoice to any valid status value (e.g. approved or rejected).
        /// This is a general-purpose status update, distinct from <see cref="SubmitInvoice"/> which
        /// is restricted to the SUBMITTED transition.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="invoiceId">The unique identifier of the invoice to update.</param>
        /// <param name="request">An <see cref="UpdateInvoiceStatusRequestDto"/> containing the new status to apply.</param>
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPatch("{invoiceId:guid}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid invoiceId, [FromBody] UpdateInvoiceStatusRequestDto request)
        {
            var result = await _service.UpdateInvoiceStatusAsync(invoiceId, request.Status);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
