using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.TimeEntry;

namespace ITSMS.Application.IServices
{
    public interface ITimeEntryService
    {
        Task<APIResponse<TimeEntryResponseDTO>> GetTimeEntryByTaskId(Guid taskId);
        Task<APIResponse<TimeEntryResponseDTO>> CreateAsync(Guid userId, List<RawCreateTimeEntryRequestDTO> req);
        Task<APIResponse<TimeEntryResponseDTO>> UpdateTimeEntryAsync(CreateTimeEntryDTO dto, Guid taskId);
        Task<APIResponse<Guid>> DeleteTimeEntryAsync(Guid taskId);

    }
}
