using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Client;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;

namespace ITSMS.Application.Services
{
    public class ClientsService : IClientsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ClientsService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Returns the total number of clients in the system.
        /// </summary>
        /// <returns></returns>

        public async Task<int> GetClientCount()
        {
            return await _unitOfWork.ClientRepository.GetClientCount();
        }

        /// <summary>
        /// Retrieves a paginated list of all clients with their associated company details.
        /// Returns a success response with <c>null</c> data and a count of 0 if no clients are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetClientDTO>>> GetAllClients(int? page, int? limit, string? search)
        {
            var clients = await _unitOfWork.ClientRepository.GetAll(page, limit, search);
            int count = await _unitOfWork.ClientRepository.GetClientCount();

            if (clients == null || !clients.Any())
                return APIResponse<List<GetClientDTO>>.Ok(null, "Clients not found", 0);
            var data = clients.Select(x => new GetClientDTO
            {
                ClientId = x.ClientId.ToString(),
                CompanyId = x.Companies.CompanyId.ToString(),
                CompanyName = x.Companies.CompanyName,
                ContactNumber = x.ContactNumber,
                ClientName = x.ClientName,
                AddressLine1 = x.AddressLine1,
                City = x.City,
                State = x.State,
                Zip = x.Zip,
                Country = x.Country,
                IsActive = x.IsActive
            }).ToList();

            return APIResponse<List<GetClientDTO>>.Ok(data, "All clients fetched successfully", count);

        }

        /// <summary>
        /// Activates or deactivates a client by updating their <c>IsActive</c> flag.
        /// Persists the change to the database after validating the client exists.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateClientStatus(Guid id, bool status)
        {
            if (id == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid client ID");;

            var client = await _unitOfWork.ClientRepository.GetById(id);
            if (client == null)
                return APIResponse<bool>.Fail("Client not found");

            client.IsActive = status;
            await _unitOfWork.Save();
            return APIResponse<bool>.Ok(true, "Client status updated successfully");
        }

        /// <summary>
        /// Retrieves a single client by their unique identifier and maps the result to a DTO.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<APIResponse<GetClientDTO>> GetClientById(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<GetClientDTO>.Fail("Invalid client ID");

            var client = await _unitOfWork.ClientRepository.GetById(id);

            if (client == null)
                return APIResponse<GetClientDTO>.Fail("Client not found");

            var dto = _mapper.Map<GetClientDTO>(client);
            return APIResponse<GetClientDTO>.Ok(dto, "Client fetched successfully");
        }

        /// <summary>
        /// Creates a new client record from the provided DTO and persists it to the database.
        /// Maps the input DTO to a <see cref="Client"/> entity and returns the created client as a DTO.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetClientDTO>> CreateClient(ClientDTO dto)
        {
            if (dto == null)
                return APIResponse<GetClientDTO>.Fail("Invalid client data");

            Client client = _mapper.Map<Client>(dto);

            await _unitOfWork.ClientRepository.Add(client);
            await _unitOfWork.Save();

            var result = _mapper.Map<GetClientDTO>(client);
            return APIResponse<GetClientDTO>.Ok(result, "Client created successfully");
        }

        /// <summary>
        /// Updates an existing client record with the data provided in the DTO.
        /// Maps the DTO onto the existing entity and persists the changes to the database.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<APIResponse<GetClientDTO>> UpdateClient(Guid id, ClientDTO dto)
        {
            if (id == Guid.Empty || dto == null)
                return APIResponse<GetClientDTO>.Fail("Invalid client data");


            var existing = await _unitOfWork.ClientRepository.GetById(id);

            if (existing == null)
                return APIResponse<GetClientDTO>.Fail("Client not found");


            _mapper.Map(dto, existing);

            await _unitOfWork.ClientRepository.Update(existing);
            await _unitOfWork.Save();

            var result = _mapper.Map<GetClientDTO>(existing);
            return APIResponse<GetClientDTO>.Ok(result, "Client updated successfully");
        }

        /// <summary>
        /// Deletes an existing client record from the database by their unique identifier.
        /// Returns the deleted client's ID on success.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<APIResponse<Guid>> DeleteClient(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid client ID");


            var existing = await _unitOfWork.ClientRepository.GetById(id);

            if (existing == null)
                return APIResponse<Guid>.Fail("Client not found");


            await _unitOfWork.ClientRepository.Delete(existing);
            await _unitOfWork.Save();

            return APIResponse<Guid>.Ok(existing.ClientId, "Client deleted successfully");
        }

        /// <summary>
        /// Retrieves all projects associated with a specific client, including the client's name and project activity status.
        /// Returns a failure response if no projects are found for the given client.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<APIResponse<List<GetProjectsByClientIdDTO>>> GetProjectsByClientId(Guid clientId)
        {
            if (clientId == Guid.Empty)
                return APIResponse<List<GetProjectsByClientIdDTO>>.Fail("Invalid client ID");


            var data = await _unitOfWork.ProjectRepository.GetProjectByClientId(clientId);

            if (data == null || !data.Any())
                return APIResponse<List<GetProjectsByClientIdDTO>>.Fail("No projects found for the specified client");


            var result = data.Select(x => new GetProjectsByClientIdDTO
            {
                ClientId = x.ClientId.ToString(),
                ProjectName = x.ProjectName,
                HourlyRate = x.HourlyRate,
                IsActive = x.IsActive ? "Yes" : "No",
                ClientName = x.Client.ClientName
            }).ToList();

            return APIResponse<List<GetProjectsByClientIdDTO>>.Ok(result, "Projects fetched successfully");
        }

        /// <summary>
        /// Retrieves all clients belonging to a specific company, each including their associated list of projects.
        /// Defaults to an empty project list for any client that has no projects.
        /// Returns a failure response if no clients are found for the given company.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetClientWithProjectsDto>>> GetClientsWithProjectsByCompanyIdAsync(Guid companyId)
        {
            if (companyId == Guid.Empty)
                return APIResponse<List<GetClientWithProjectsDto>>.Fail("Invalid company ID");

            var clients = await _unitOfWork.ClientRepository.GetClientAndProjectByCompanyId(companyId);

            if (clients == null || !clients.Any())
                return APIResponse<List<GetClientWithProjectsDto>>.Fail("No clients found for the specified company");

            var result = clients.Select(c => new GetClientWithProjectsDto
            {
                ClientId = c.ClientId.ToString(),
                ClientName = c.ClientName,
                ContactNumber = c.ContactNumber,
                IsActive = c.IsActive,
                Projects = (c.Projects ?? new List<Project>()).Select(p => new ProjectListDto
                {
                    ProjectId = p.ProjectId.ToString(),
                    ProjectName = p.ProjectName,
                    HourlyRate = p.HourlyRate,
                    IsActive = p.IsActive
                }).ToList()
            }).ToList();

            return APIResponse<List<GetClientWithProjectsDto>>.Ok(result, "Clients with projects fetched successfully");

        }

    }
}
