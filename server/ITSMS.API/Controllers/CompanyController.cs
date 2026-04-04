using ITSMS.API.helper;
using ITSMS.Application.DTOs.Company;
using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        /// <summary>
        /// Returns the total number of company records in the system.
        /// Accessible by Admin and Employee roles.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("GetCompanyCount")]
        public async Task<IActionResult> GetTotalCompany()
        {
            int res = await _companyService.GetCompanyCount();
            return Ok(res);
        }

        /// <summary>
        /// Retrieves a paginated list of all companies.
        /// Accessible by Admin and Employee roles.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("GetAllCompanies")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] int page = 0, [FromQuery] int limit = 0, [FromQuery] string? search = null)
        {
            var result = await _companyService.GetAllCompanies(page, limit, search);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Retrieves a single company by its unique identifier.
        /// Accessible by Admin and Employee roles.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("GetById/{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _companyService.GetById(id);
            return result.Success ? Ok(result) : NotFound(result);
        }


        /// <summary>
        /// Retrieves all bank details associated with a specific company.
        /// Accessible by Admin and Employee roles.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("GetBankDetailByCompanyId/{companyId:guid}")]
        public async Task<IActionResult> GetBankDetailByCompanyId(Guid companyId)
        {
            var result = await _companyService.GetBankDetailByCompanyId(companyId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Creates a new company record from the provided form data, including an optional logo file upload.
        /// The logo file is saved to disk via <c>UploadImage.SaveCompanyLogoAsync</c> before the company is persisted.
        /// Restricted to users with the Admin role.
        /// Consumes multipart/form-data to support file uploads.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPost("AddCompany")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddCompany([FromForm] CompanyDTO dto)
        {
            dto.CompanyLogo = await UploadImage.SaveCompanyLogoAsync(dto.LogoFile);
           
            var result = await _companyService.AddCompany(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>
        /// Activates or deactivates a company by updating its active status.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateCompanyStatus/{id:guid}")]
        public async Task<IActionResult> GetCompanyStatus(Guid id, [FromQuery] bool status)
        {
            var result = await _companyService.UpdateCompanyStatus(id, status);
            return result.Success ? Ok(result) : NotFound(result);

        }

        /// <summary>
        /// Updates an existing company record with the provided form data.
        /// If a new logo file is included in the request, it is saved to disk via
        /// <c>UploadImage.SaveCompanyLogoAsync</c> and replaces the existing logo.
        /// If no logo file is provided, the existing logo is preserved by the service layer.
        /// Restricted to users with the Admin role.
        /// Consumes multipart/form-data to support file uploads.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateCompany/{id:guid}")]
        [Consumes("multipart/form-data")]

        public async Task<IActionResult> UpdateCompany(Guid id, [FromForm] CompanyDTO dto)
        {
            if (dto.LogoFile != null)
            {
                var logoPath = await UploadImage.SaveCompanyLogoAsync(dto.LogoFile);
                dto.CompanyLogo = logoPath;
            }

            var result = await _companyService.UpdateCompany(id, dto);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Deletes an existing company record by its unique identifier.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteCompany/{id:guid}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var result = await _companyService.DeleteCompany(id);
            return result.Success ? Ok(result) : NotFound(result);
        }


    }
}




