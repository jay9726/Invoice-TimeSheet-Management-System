using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Company;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;

namespace ITSMS.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CompanyService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Returns the total number of company records in the system.
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetCompanyCount()
        {
            return await _unitOfWork.CompanyRepository.GetCompanyCount();
        }

        /// <summary>
        /// Retrieves a paginated list of all companies, mapped to DTOs.
        /// Returns a success response with <c>null</c> data and a count of 0 if no records are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetCompanyDTO>>> GetAllCompanies(int? page, int? limit, string? search)
        {
            var companies = await _unitOfWork.CompanyRepository.GetAll(page, limit, search);

            if (companies == null || !companies.Any())
                return APIResponse<List<GetCompanyDTO>>.Ok(null,"Companies not found",0);

            int count = await _unitOfWork.CompanyRepository.GetCompanyCount();

            var result = _mapper.Map<List<GetCompanyDTO>>(companies);

            return APIResponse<List<GetCompanyDTO>>.Ok(result, "All companies fetched successfully", count);
        }

        /// <summary>
        /// Activates or deactivates a company by updating its <c>IsActive</c> flag.
        /// Persists the change to the database after validating the company exists.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateCompanyStatus(Guid id, bool status)
        {
            if (id  == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid company ID");

            var company = await _unitOfWork.CompanyRepository.GetById(id);
            if (company == null)
                return APIResponse<bool>.Fail("Company not found");

            company.IsActive = status;
            await _unitOfWork.Save();

            return APIResponse<bool>.Ok(true, "Company status updated successfully");
        }

        /// <summary>
        /// Retrieves a single company by its unique identifier and maps the result to a DTO.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetCompanyDTO>> GetById(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<GetCompanyDTO>.Fail("Invalid company ID");

            var company = await _unitOfWork.CompanyRepository.GetById(id);
            if (company == null)
                return APIResponse<GetCompanyDTO>.Fail("Company not found");

            var result = _mapper.Map<GetCompanyDTO>(company);
            return APIResponse<GetCompanyDTO>.Ok(result, "Company fetched successfully");
        }

        /// <summary>
        /// Creates a new company record from the provided DTO and persists it to the database.
        /// Maps the input DTO to a <see cref="CompanyDTO"/> entity and returns the created company as a DTO.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetCompanyDTO>> AddCompany(CompanyDTO dto)
        {
            if (dto == null)
                return APIResponse<GetCompanyDTO>.Fail("Invalid company data");

            var entity = _mapper.Map<Company>(dto);
            await _unitOfWork.CompanyRepository.Add(entity);
            await _unitOfWork.Save();

            var result = _mapper.Map<GetCompanyDTO>(entity);
            return APIResponse<GetCompanyDTO>.Ok(result, "Company added successfully");
        }

        /// <summary>
        /// Updates an existing company record with the data provided in the DTO.
        /// Maps the DTO onto the existing entity and persists the changes to the database.
        /// If <c>CompanyLogo</c> is not provided in the DTO, the existing logo is preserved.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetCompanyDTO>> UpdateCompany(Guid id, CompanyDTO dto)
        {
            if (id == Guid.Empty || dto == null)
                return APIResponse<GetCompanyDTO>.Fail("Invalid company data");

            var existing = await _unitOfWork.CompanyRepository.GetById(id);
            if (existing == null)
                return APIResponse<GetCompanyDTO>.Fail("Company not found");

            var existingLogo = existing.CompanyLogo;
            _mapper.Map(dto, existing);

            if (dto.CompanyLogo == null)
                existing.CompanyLogo = existingLogo;

            await _unitOfWork.CompanyRepository.Update(existing);
            await _unitOfWork.Save();

            var result = _mapper.Map<GetCompanyDTO>(existing);
            return APIResponse<GetCompanyDTO>.Ok(result, "Company updated successfully");
        }

        /// <summary>
        /// Deletes an existing company record from the database by its unique identifier.
        /// Returns the deleted company's ID on success.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        public async Task<APIResponse<Guid>> DeleteCompany(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid company ID");

            var existing = await _unitOfWork.CompanyRepository.GetById(id);
            if (existing == null)
                return APIResponse<Guid>.Fail("Company not found");

            await _unitOfWork.CompanyRepository.Delete(existing);
            await _unitOfWork.Save();

            return APIResponse<Guid>.Ok(existing.CompanyId, "Company deleted successfully");
        }

        /// <summary>
        /// Retrieves all bank details associated with a specific company, including account and routing information.
        /// Returns a failure response if no bank details are found for the given company.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public async Task<APIResponse<List<GetBankDetailByCompanyIdDTO>>> GetBankDetailByCompanyId(Guid companyId)
        {
            if (companyId == Guid.Empty)
                return APIResponse<List<GetBankDetailByCompanyIdDTO>>.Fail("Invalid company ID");

            var data = await _unitOfWork.CompanyBankDetailRepository.GetBankDetailByCompanyId(companyId);

            if (data == null || !data.Any())
                return APIResponse<List<GetBankDetailByCompanyIdDTO>>.Fail("No bank details found");

            var result = data.Select(x => new GetBankDetailByCompanyIdDTO
            {
                CompanyId = companyId.ToString(),
                BankName = x.BankName,
                SwiftCode = x.SwiftCode,
                AccountName = x.AccountName,
                AccountNumber = x.AccountNumber,
                RoutingNumber = x.RoutingNumber,
                IsActive = x.IsActive,
                CompanyName = x.Company?.CompanyName
            }).ToList();

            return APIResponse<List<GetBankDetailByCompanyIdDTO>>.Ok(result, "Bank details fetched successfully");
        }
    }
}
