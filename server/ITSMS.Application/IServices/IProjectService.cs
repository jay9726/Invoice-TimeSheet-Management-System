using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Project;

namespace ITSMS.Application.IServices
{
    public interface IProjectService
    {
        Task<int> GetProjectCount();

        Task<APIResponse<List<GetProjectsByClientIdDTO>>> GetAllProjects(int? page, int? limit, string? search);

        Task<APIResponse<GetProjectsByClientIdDTO>> GetProjectById(Guid id);

        Task<APIResponse<GetProjectsByClientIdDTO>> CreateProject(ProjectDTO dto);

        Task<APIResponse<GetProjectsByClientIdDTO>> UpdateProject(Guid id, ProjectDTO dto);

        Task<APIResponse<Guid>> DeleteProject(Guid id);

        Task<APIResponse<bool>> UpdateProjectStatus(Guid id, bool status);

    }
}
