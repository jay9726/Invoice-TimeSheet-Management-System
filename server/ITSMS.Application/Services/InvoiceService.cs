using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Invoice;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public InvoiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves all companies available for invoicing, with an optional search filter.
        /// For each company, also fetches the associated client count and includes it in the result.
        /// Returns a success response with <c>null</c> data and a count of 0 if no companies are found.
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetInvoiceCompanyDTO>>> GetCompaniesAsync(string? search)
        {
            var companies = await _unitOfWork.InvoiceRepository.GetCompaniesAsync(search);

            if (companies == null || !companies.Any())
                return APIResponse<List<GetInvoiceCompanyDTO>>.Ok(null,"No companies found",0);

            var result = new List<GetInvoiceCompanyDTO>();

            foreach (var company in companies)
            {
                var clientCount = await _unitOfWork.InvoiceRepository.GetClientCountByCompanyIdAsync(company.CompanyId);

                result.Add(new GetInvoiceCompanyDTO
                {
                    CompanyId = company.CompanyId.ToString(),
                    CompanyLogo = company.CompanyLogo,
                    CompanyName = company.CompanyName,
                    AddressLine1 = company.AddressLine1,
                    City = company.City,
                    State = company.State,
                    Zip = company.Zip,
                    Country = company.Country,
                    IsActive = company.IsActive,
                    ClientCount = clientCount
                });
            }

            return APIResponse<List<GetInvoiceCompanyDTO>>.Ok(result, "Companies loaded");
        }

        /// <summary>
        /// Retrieves a paginated list of clients belonging to a specific company, with an optional search filter.
        /// For each client, also fetches their most recent invoice status and includes it in the result.
        /// Returns a success response with <c>null</c> data and a count of 0 if no clients are found.
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>


        public async Task<APIResponse<List<ClientMiniDto>>> GetClientsByCompanyIdAsync(Guid companyId, int? page, int? limit, string? search)
        {
            if (companyId == Guid.Empty)
                return APIResponse<List<ClientMiniDto>>.Fail("Invalid company ID");

            var clients = await _unitOfWork.InvoiceRepository.GetClientsByCompanyIdAsync(companyId, page, limit, search);

            if (clients == null || !clients.Any())
                return APIResponse<List<ClientMiniDto>>.Ok(null,"Clients not found",0);

            int count = await _unitOfWork.InvoiceRepository.GetClientCountByCompanyIdAsync(companyId);

            var result = new List<ClientMiniDto>();

            foreach (var c in clients)
            {
                var latest = await _unitOfWork.InvoiceRepository.GetInvoiceByClientIdAsync(c.ClientId);

                result.Add(new ClientMiniDto
                {
                    ClientId = c.ClientId.ToString(),
                    CompanyId = c.CompanyId.ToString(),
                    ClientName = c.ClientName,
                    IsActive = c.IsActive,
                    InvoiceStatus = latest?.Status.ToString()
                });
            }

            return APIResponse<List<ClientMiniDto>>.Ok(result, "Clients loaded", count);
        }


        /// <summary>
        /// Builds a full invoice preview for a given client by aggregating time entry data across their projects.
        /// Resolves company info, billing address, active bank details, payment terms, and per-project
        /// hours and amounts. If no billable hours exist, returns a valid preview with an empty project list
        /// and a total amount of zero. Invoice and PO numbers can be overridden via optional parameters;
        /// otherwise the existing values from the repository are used.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="invoiceNumber"></param>
        /// <param name="PONumber"></param>
        /// <returns></returns>
        public async Task<APIResponse<InvoicePreviewResponseDto>> GetInvoicePreviewAsync(Guid clientId, string? invoiceNumber = null, string? PONumber = null)
        {
            if (clientId == Guid.Empty)
                return APIResponse<InvoicePreviewResponseDto>.Fail("Invalid client ID");

            var client = await _unitOfWork.InvoiceRepository.GetClientWithCompanyAsync(clientId);
            if (client == null)
                return APIResponse<InvoicePreviewResponseDto>.Fail("Client not found");

            var company = client.Companies;
            if (company == null)
                return APIResponse<InvoicePreviewResponseDto>.Fail("Company not found for this client");

            var bank = await _unitOfWork.InvoiceRepository.GetActiveBankDetailByCompanyIdAsync(client.CompanyId);
            if (bank == null)
                return APIResponse<InvoicePreviewResponseDto>.Fail("Bank details not found for this company");

            var projectPayment = await _unitOfWork.InvoiceRepository.GetPaymentTermsByIdAsync(clientId);

            var invoiceData = await _unitOfWork.InvoiceRepository.GetInvoiceAndPONumber(clientId);

            var agg = await _unitOfWork.InvoiceRepository.GetProjectAggFromTimeEntryAsync(clientId);

            var companyHeader = new CompanyHeaderDto
            {
                CompanyId = company.CompanyId.ToString(),
                CompanyName = company.CompanyName,
                companyLogo = company.CompanyLogo,
                AddressLine1 = company.AddressLine1,
                City = company.City,
                State = company.State,
                Zip = company.Zip,
                Country = company.Country
            };

            var billTo = new ClientBillToDto
            {
                ClientId = client.ClientId.ToString(),
                ClientName = client.ClientName,
                ContactNumber = client.ContactNumber,
                AddressLine1 = client.AddressLine1,
                City = client.City,
                State = client.State,
                Zip = client.Zip,
                Country = client.Country
            };

            var bankDto = new BankDetailDto
            {
                BankDetailId = bank.BankDetailId.ToString(),
                BankName = bank.BankName,
                SwiftCode = bank.SwiftCode,
                AccountName = bank.AccountName,
                AccountNumber = bank.AccountNumber,
                RoutingNumber = bank.RoutingNumber
            };

            if (agg.Count == 0)
            {
                var empty = new InvoicePreviewResponseDto
                {
                    Company = companyHeader,
                    BillTo = billTo,
                    BankDetails = bankDto,
                    Projects = new List<InvoiceProjectPreviewDto>(),
                    PaymentTerms = projectPayment.PaymentTerms,
                    InvoiceNumber = invoiceNumber ?? invoiceData.InvoiceNumber,
                    PONumber = PONumber ?? invoiceData.PONumber,
                    TotalAmount = 0
                };

                return APIResponse<InvoicePreviewResponseDto>.Ok(empty, "Invoice preview generated (no billable hours)");
            }

            var projectIds = agg.Select(x => x.ProjectId).Distinct().ToList();
            var projects = await _unitOfWork.InvoiceRepository.GetProjectsByIdsAsync(projectIds);

            var rows = new List<InvoiceProjectPreviewDto>();

            foreach (var a in agg)
            {
                var p = projects.FirstOrDefault(x => x.ProjectId == Guid.Parse(a.ProjectId));
                if (p == null) continue;

                rows.Add(new InvoiceProjectPreviewDto
                {
                    ProjectId = p.ProjectId.ToString(),
                    ProjectName = p.ProjectName,
                    PaymentTerms = p.PaymentTerms,
                    TotalHours = a.TotalHours,
                    Rate = p.HourlyRate,
                    FromDate = a.FromDate,
                    ToDate = a.ToDate,
                    Amount = Math.Round(a.TotalHours * p.HourlyRate, 2)
                });
            }

            var preview = new InvoicePreviewResponseDto
            {
                Company = companyHeader,
                BillTo = billTo,
                BankDetails = bankDto,
                Projects = rows.OrderBy(x => x.ProjectName).ToList(),
                PaymentTerms = projectPayment.PaymentTerms,
                InvoiceNumber = invoiceNumber ?? invoiceData.InvoiceNumber,
                PONumber = PONumber ?? invoiceData.PONumber,
                TotalAmount = rows.Sum(x => x.Amount)
            };

            return APIResponse<InvoicePreviewResponseDto>.Ok(preview, "Invoice preview generated");
        }


        /// <summary>
        /// Generates or updates an invoice for a given client based on the current invoice preview data.
        /// If no invoice exists for the client, a new invoice and its line items are created with a
        /// <see cref="InvoiceStatus.DRAFT"/> status, auto-generating the invoice and PO numbers.
        /// If an invoice already exists, new project items are appended, existing items are updated
        /// with the latest hours and amounts, and the invoice total is recalculated.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="clientId"></param>
        /// <returns></returns>


        public async Task<APIResponse<SubmitInvoiceResponseDto>> GenerateInvoiceAsync(Guid userId, Guid clientId)
        {
            if (userId == Guid.Empty || clientId == Guid.Empty)
                return APIResponse<SubmitInvoiceResponseDto>.Fail("Invalid user ID or client ID");

            var existing = await _unitOfWork.InvoiceRepository.GetInvoiceByClientIdAsync(clientId);

            if (existing == null)
            {
                var date = DateOnly.FromDateTime(DateTime.UtcNow);
                var invoiceNumber = await _unitOfWork.InvoiceRepository.GenerateNextInvoiceNumberAsync(date);
                var PONumber = await _unitOfWork.InvoiceRepository.GenerateNextProductOrderNumberAsync(date);

                var previewResponse = await GetInvoicePreviewAsync(clientId, invoiceNumber, PONumber);
                if (!previewResponse.Success)
                    return APIResponse<SubmitInvoiceResponseDto>.Fail(previewResponse.Message);

                var invoicePreview = previewResponse.Data!;

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    CompanyId = Guid.Parse(invoicePreview.Company.CompanyId),
                    ClientId = Guid.Parse(invoicePreview.BillTo.ClientId),
                    InvoiceDate = date,
                    PaymentTerms = invoicePreview.PaymentTerms,
                    PONumber = PONumber,
                    TotalAmount = invoicePreview.TotalAmount,
                    Status = InvoiceStatus.DRAFT,
                    CreatedDate = date,
                    CreatedBy = userId,
                };

                var invoiceId = await _unitOfWork.InvoiceRepository.CreateInvoiceAsync(invoice);

                var entityItems = invoicePreview.Projects.Select(p => new InvoiceItem
                {
                    InvoiceId = invoiceId,
                    ProjectId = Guid.Parse(p.ProjectId),
                    Quantity = p.TotalHours,
                    Description = p.ProjectName,
                    Rate = p.Rate,
                    FromDate = p.FromDate,
                    ToDate = p.ToDate,
                    Amount = p.Amount
                }).ToList();

                if (entityItems.Count > 0)
                    await _unitOfWork.InvoiceRepository.CreateInvoiceItemAsync(entityItems);

                var created = new SubmitInvoiceResponseDto
                {
                    IsCreated = true,
                    InvoiceId = invoiceId.ToString(),
                    InvoiceNumber = invoice.InvoiceNumber,
                    TotalAmount = invoice.TotalAmount,
                    Status = invoice.Status.ToString()
                };

                return APIResponse<SubmitInvoiceResponseDto>.Ok(created, "Invoice generated successfully");
            }


            var existingPreviewResponse = await GetInvoicePreviewAsync(clientId);
            if (!existingPreviewResponse.Success)
                return APIResponse<SubmitInvoiceResponseDto>.Fail(existingPreviewResponse.Message);

            var existingPreview = existingPreviewResponse.Data!;
            var existingProjectIds = await _unitOfWork.InvoiceRepository.GetInvoiceItemProjectIdsAsync(existing.InvoiceId);

            var newProjects = existingPreview.Projects
               .Where(p => !existingProjectIds.Contains(Guid.Parse(p.ProjectId)))
               .ToList();

            var updatedProjects = existingPreview.Projects
                .Where(p => existingProjectIds.Contains(Guid.Parse(p.ProjectId)))
                .ToList();

            if (newProjects.Count > 0)
            {
                var newItems = newProjects.Select(p => new InvoiceItem
                {
                    InvoiceId = existing.InvoiceId,
                    ProjectId = Guid.Parse(p.ProjectId),
                    Quantity = p.TotalHours,
                    Description = p.ProjectName,
                    Rate = p.Rate,
                    FromDate = p.FromDate,
                    ToDate = p.ToDate,
                    Amount = p.Amount
                }).ToList();

                await _unitOfWork.InvoiceRepository.CreateInvoiceItemAsync(newItems);
            }

            
            if (updatedProjects.Count > 0)
            {
                await _unitOfWork.InvoiceRepository.UpdateInvoiceItemsByProjectsAsync(
                    existing.InvoiceId, updatedProjects);
            }

            await _unitOfWork.InvoiceRepository.UpdateInvoiceTotalAsync(existing.InvoiceId, existingPreview.TotalAmount);

            var result = new SubmitInvoiceResponseDto
            {
                IsCreated = true,
                InvoiceId = existing.InvoiceId.ToString(),
                InvoiceNumber = existing.InvoiceNumber,
                TotalAmount = existingPreview.TotalAmount,
                Status = existing.Status.ToString()
            };

            return APIResponse<SubmitInvoiceResponseDto>.Ok(result, "Invoice updated successfully");
        }

        /// <summary>
        /// Submits a draft invoice for review by updating its status to <see cref="InvoiceStatus.SUBMITTED"/>.
        /// Returns a failure response if the invoice is not found or the status update fails.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> SubmitInvoiceAsync(Guid invoiceId)
        {
            if (invoiceId == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid invoice ID");

            var updated = await _unitOfWork.InvoiceRepository.SubmitInvoiceStatusAsync(invoiceId, InvoiceStatus.SUBMITTED);
            if (!updated)
                return APIResponse<bool>.Fail("Invoice not found or could not be submitted");

            return APIResponse<bool>.Ok(true, "Invoice submitted successfully");
        }

        /// <summary>
        /// Updates the status of an invoice to any valid <see cref="InvoiceStatus"/> value.
        /// This is a general-purpose status update, as opposed to <see cref="SubmitInvoiceAsync"/>
        /// which is restricted to the SUBMITTED transition.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateInvoiceStatusAsync(Guid invoiceId, InvoiceStatus status)
        {
            if (invoiceId == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid invoice ID");

            await _unitOfWork.InvoiceRepository.UpdateInvoiceStatusAsync(invoiceId, status);

            return APIResponse<bool>.Ok(true, "Invoice status updated successfully");
        }
    }
}
