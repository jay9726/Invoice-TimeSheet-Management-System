using ITSMS.Application.DTOs.Admin;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Invoice;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a paginated list of companies available for invoice generation.
        /// Returns company details such as name, address, and active status.
        /// Returns a successful response with <c>null</c> data and a count of 0 if no companies are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<APIResponse<List<AdminCompanyDTO>>> GetAdminCompaniesForInvoiceAsync(int? page, int? limit, string? search)
        {
            var companies = await _unitOfWork.AdminRepository.GetAdminCompanyForInvoiceAsync(page, limit, search);

            if (companies == null || !companies.Any())
                return APIResponse<List<AdminCompanyDTO>>.Ok(null,"Companies not found",0);

            int count = await _unitOfWork.CompanyRepository.GetCompanyCount();

            var result = companies.Select(x => new AdminCompanyDTO
            {
                CompanyId = x.CompanyId.ToString(),
                CompanyLogo = x.CompanyLogo,
                CompanyName = x.CompanyName!,
                AddressLine1 = x.AddressLine1!,
                City = x.City,
                State = x.State,
                Zip = x.Zip,
                Country = x.Country!,
                IsActive = x.IsActive
            }).ToList();

            return APIResponse<List<AdminCompanyDTO>>.Ok(result, "All companies fetched successfully", count);

        }

        /// <summary>
        /// Retrieves all invoices associated with a specific client company, with optional search filtering.
        /// Returns invoice details including client info, amount, status, and invoice metadata.
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<AdminInvoiceResponseDTO>>> GetAdminClientInvoice(Guid companyId, string? search)
        {
            if (companyId == Guid.Empty)
                return APIResponse<List<AdminInvoiceResponseDTO>>.Fail("Invalid company ID");


            var (data, totalCount) = await _unitOfWork.AdminRepository.GetAdminClientInvoicesAsync(companyId, search);

            if (data == null || !data.Any())
                return APIResponse<List<AdminInvoiceResponseDTO>>.Ok(null,"No invoices found",0);


            var result = data.Select(x => new AdminInvoiceResponseDTO
            {
                InvoiceId = x.Invoice.InvoiceId.ToString(),
                CompanyId = x.Client.CompanyId.ToString(),
                ClientId = x.Client.ClientId.ToString(),
                ClientName = x.Client.ClientName,
                TotalAmount = (double)x.Invoice.TotalAmount,
                Status = x.Invoice.Status.ToString(),
                InvoiceDate = x.Invoice.InvoiceDate.ToString(),
                InvoiceNumber = x.Invoice.InvoiceNumber,
                PONumber = x.Invoice.PONumber,
            }).ToList();

            return APIResponse<List<AdminInvoiceResponseDTO>>.Ok(result, "Invoices fetched successfully", totalCount);
        }

        /// <summary>
        /// Updates the approval status of an invoice (e.g., approved, rejected, or pending).
        /// Persists the status change to the database after validating the invoice exists.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> InvoiceDecision(Guid invoiceId, InvoiceStatus status)
        {
            if (invoiceId == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid invoice ID");

            var invoice = await _unitOfWork.AdminRepository.GetInvoiceById(invoiceId);

            if (invoice == null)
                return APIResponse<bool>.Fail("Invoice not found");

            invoice.Status = status;
            await _unitOfWork.Save();

            return APIResponse<bool>.Ok(true, "Invoice updated successfully");
        }
    }
}
