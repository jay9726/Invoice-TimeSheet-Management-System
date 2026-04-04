using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;

namespace ITSMS.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EmployeeService(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Returns the total number of employee records in the system.
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetEmployeeCount()
        {
            return await _unitOfWork.EmployeeRepository.GetEmployeeCount();
        }

        /// <summary>
        /// Retrieves a paginated list of all employees along with their assigned roles.
        /// Fetches roles in bulk by mapping user IDs to their role collections, then picks
        /// the first role per employee. Returns a success response with <c>null</c> data
        /// and a count of 0 if no employees are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<APIResponse<List<GetEmployeeDTO>>> GetAllEmployeeAsync(int? page, int? limit, string? search)
        {
            var res = await _unitOfWork.EmployeeRepository.GetAllEmployeeAsync(page, limit, search);

            if (res == null || res.Count == 0)
                return APIResponse<List<GetEmployeeDTO>>.Ok(null,"No employees found",0);

            var count = await _unitOfWork.EmployeeRepository.GetEmployeeCount();


            var userIds = res.Select(x => x.Id);
            var rolesMap = await _unitOfWork.EmployeeRepository.GetRolesByUserIdsAsync(userIds);


            var employees = res.Select(x => new GetEmployeeDTO
            {
                EmployeeId = x.Id.ToString(),
                Email = x.Email ?? "",  
                FullName = x.FullName,
                Role = rolesMap[x.Id].FirstOrDefault() ?? "",
                IsActive = x.IsActive
            }).ToList();

            return APIResponse<List<GetEmployeeDTO>>.Ok(employees, "All employees fetched successfully", count);

        }

        /// <summary>
        /// Activates or deactivates an employee by updating their <c>IsActive</c> flag.
        /// Persists the change to the database after validating the employee exists.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateEmployeeStatus(Guid id, bool status)
        {
            if (id == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid employee ID");

            var employee = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(id);
            if (employee == null)
                return APIResponse<bool>.Fail("Employee not found");

            employee.IsActive = status;
            await _unitOfWork.Save();

            return APIResponse<bool>.Ok(true, "Employee status updated successfully");
        }

        /// <summary>
        /// Retrieves a single employee by their unique identifier, including their assigned role.
        /// Fetches the employee's roles separately and picks the first role for the DTO.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<APIResponse<GetEmployeeDTO>> GetEmployeeByIdAsync(Guid userId)
        {
            if (userId == Guid.Empty)
                return APIResponse<GetEmployeeDTO>.Fail("Invalid employee ID");

            var employee = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(userId);
            if (employee == null)
                return APIResponse<GetEmployeeDTO>.Fail("Employee not found");

            var roles = await _unitOfWork.EmployeeRepository.GetRolesByUserIdAsync(employee.Id);

            var result = new GetEmployeeDTO
            {
                EmployeeId = employee.Id.ToString(),
                Email = employee.Email ?? "",
                FullName = employee.FullName,
                Role = roles.FirstOrDefault() ?? "",
                IsActive = employee.IsActive
            };

            return APIResponse<GetEmployeeDTO>.Ok(result, "Employee fetched successfully");
        }

        /// <summary>
        /// Updates an existing employee's profile and role assignment.
        /// Maps the DTO onto the existing entity and persists the changes to the database.
        /// If a new role is provided in the DTO, all current roles are removed and replaced with the new one.
        /// If no role is provided, the employee's existing role is retained in the returned DTO.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetEmployeeDTO>> UpdateEmployee(Guid id, UpdateEmployeeDTO dto)
        {
            if (id == Guid.Empty || dto == null)
                return APIResponse<GetEmployeeDTO>.Fail("Invalid employee data");

            var existing = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(id);
            if (existing == null)
                return APIResponse<GetEmployeeDTO>.Fail("Employee not found");

            _mapper.Map(dto, existing);

            var updated = await _unitOfWork.EmployeeRepository.Update(existing);
            await _unitOfWork.Save();

            string updatedRole;

            if (!string.IsNullOrWhiteSpace(dto.Role))
            {
                var newRole = dto.Role.Trim();
                var currentRoles = await _unitOfWork.AuthRepository.GetRolesAsync(existing);

                if (currentRoles.Any())
                    await _unitOfWork.AuthRepository.RemoveFromRolesAsync(existing, currentRoles);

                await _unitOfWork.AuthRepository.AddToRoleAsync(existing, newRole);
                updatedRole = newRole;
            }
            else
            {
                var roles = await _unitOfWork.AuthRepository.GetRolesAsync(existing);
                updatedRole = roles.FirstOrDefault() ?? "";
            }

            var result = new GetEmployeeDTO
            {
                EmployeeId = updated.Id.ToString(),
                FullName = updated.FullName,
                Email = updated.Email,
                Role = updatedRole,
                IsActive = updated.IsActive
            };

            return APIResponse<GetEmployeeDTO>.Ok(result, "Employee updated successfully");
        }
        /// <summary>
        /// Deletes an existing employee record from the database by their unique identifier.
        /// Returns the deleted employee's ID on success.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        public async Task<APIResponse<Guid>> DeleteEmployee(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid employee ID");

            var existing = await _unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(id);
            if (existing == null)
                return APIResponse<Guid>.Fail("Employee not found");

            await _unitOfWork.EmployeeRepository.Delete(existing);
            await _unitOfWork.Save();

            return APIResponse<Guid>.Ok(existing.Id, "Employee deleted successfully");
        }


    }
}
