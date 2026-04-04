using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Client;

namespace ITSMS.Application.IServices
{
    public interface IClientsService
    {
        Task<int> GetClientCount();

        Task<APIResponse<List<GetClientDTO>>> GetAllClients(int? page, int? limit, string? search);

        Task<APIResponse<bool>> UpdateClientStatus(Guid id, bool status);

        Task<APIResponse<GetClientDTO>> GetClientById(Guid id);

        Task<APIResponse<GetClientDTO>> CreateClient(ClientDTO dto);

        Task<APIResponse<GetClientDTO>> UpdateClient(Guid id, ClientDTO dto);

        Task<APIResponse<Guid>> DeleteClient(Guid id);

        Task<APIResponse<List<GetProjectsByClientIdDTO>>> GetProjectsByClientId(Guid clientId);

        Task<APIResponse<List<GetClientWithProjectsDto>>> GetClientsWithProjectsByCompanyIdAsync(Guid companyId);
    }
}
