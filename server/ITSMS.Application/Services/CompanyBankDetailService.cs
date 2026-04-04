using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.CompanyBankDetail;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;

namespace ITSMS.Application.Services
{
    public class CompanyBankDetailService : ICompanyBankDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CompanyBankDetailService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        /// <summary>
        /// Returns the total number of company bank detail records in the system.
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetBankDetailsCount()
        {
            return await _unitOfWork.CompanyBankDetailRepository.GetBankDetailsCount();
        }
        /// <summary>
        /// Retrieves a paginated list of all company bank details, mapped to DTOs.
        /// Returns a success response with <c>null</c> data and a count of 0 if no records are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetCompanyBankDetailsDTO>>> GetAllBankDetails(int? page, int? limit, string? search)
        {
            var bankDetails = await _unitOfWork.CompanyBankDetailRepository.GetAll(page, limit, search);

            if (bankDetails == null || !bankDetails.Any())
                return APIResponse<List<GetCompanyBankDetailsDTO>>.Ok(null,"Bank details not found",0);

            int count = await _unitOfWork.CompanyBankDetailRepository.GetBankDetailsCount();

            var result = _mapper.Map<List<GetCompanyBankDetailsDTO>>(bankDetails);

            return APIResponse<List<GetCompanyBankDetailsDTO>>.Ok(result, "All bank details fetched successfully", count);
        }

        /// <summary>
        /// Activates or deactivates a company bank detail record by updating its <c>IsActive</c> flag.
        /// Persists the change to the database after validating the record exists.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateBankDetailStatus(Guid id, bool status)
        {
            if (id == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid bank detail ID");

            var bankDetail = await _unitOfWork.CompanyBankDetailRepository.GetById(id);
            if (bankDetail == null)
                return APIResponse<bool>.Fail("Bank detail not found");

            bankDetail.IsActive = status;
            await _unitOfWork.Save();

            return APIResponse<bool>.Ok(true, "Bank detail status updated successfully");
        }

        /// <summary>
        /// Retrieves a single company bank detail record by its unique identifier and maps the result to a DTO.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<APIResponse<GetCompanyBankDetailsDTO>> GetBankDetailById(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<GetCompanyBankDetailsDTO>.Fail("Invalid bank detail ID");

            var bankDetail = await _unitOfWork.CompanyBankDetailRepository.GetById(id);
            if (bankDetail == null)
                return APIResponse<GetCompanyBankDetailsDTO>.Fail("Bank detail not found");

            var result = _mapper.Map<GetCompanyBankDetailsDTO>(bankDetail);
            return APIResponse<GetCompanyBankDetailsDTO>.Ok(result, "Bank detail fetched successfully");
        }

        /// <summary>
        /// Creates a new company bank detail record from the provided DTO and persists it to the database.
        /// Maps the input DTO to a <see cref="CompanyBankDetail"/> entity and returns the created record as a DTO.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<CompanyBankDetailDTO>> CreateBankDetail(CompanyBankDetailDTO dto)
        {
            if (dto == null)
                return APIResponse<CompanyBankDetailDTO>.Fail("Invalid bank detail data");

            var entity = _mapper.Map<CompanyBankDetail>(dto);
            await _unitOfWork.CompanyBankDetailRepository.Add(entity);
            await _unitOfWork.Save();

            var result = _mapper.Map<CompanyBankDetailDTO>(entity);
            return APIResponse<CompanyBankDetailDTO>.Ok(result, "Bank detail created successfully");
        }

        /// <summary>
        /// Updates an existing company bank detail record with the data provided in the DTO.
        /// Maps the DTO onto the existing entity and persists the changes to the database.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<APIResponse<CompanyBankDetailDTO>> UpdateBankDetail(Guid id, CompanyBankDetailDTO dto)
        {
            if (id == Guid.Empty || dto == null)
                return APIResponse<CompanyBankDetailDTO>.Fail("Invalid bank detail data or ID");

            var existing = await _unitOfWork.CompanyBankDetailRepository.GetById(id);
            if (existing == null)
                return APIResponse<CompanyBankDetailDTO>.Fail("Bank detail not found");

            _mapper.Map(dto, existing);
            await _unitOfWork.CompanyBankDetailRepository.Update(existing);
            await _unitOfWork.Save();

            var result = _mapper.Map<CompanyBankDetailDTO>(existing);
            return APIResponse<CompanyBankDetailDTO>.Ok(result, "Bank detail updated successfully");
        }

        /// <summary>
        /// Deletes an existing company bank detail record from the database by its unique identifier.
        /// Returns the deleted record's ID on success.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<APIResponse<Guid>> DeleteBankDetail(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid bank detail ID");

            var existing = await _unitOfWork.CompanyBankDetailRepository.GetById(id);
            if (existing == null)
                return APIResponse<Guid>.Fail("Bank detail not found");

            await _unitOfWork.CompanyBankDetailRepository.Delete(existing);
            await _unitOfWork.Save();

            return APIResponse<Guid>.Ok(existing.BankDetailId, "Bank detail deleted successfully");
        }

    }
}
