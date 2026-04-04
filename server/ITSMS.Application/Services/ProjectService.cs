using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.Project;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;

namespace ITSMS.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProjectService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Returns the total number of project records in the system.
        /// </summary>
        /// <returns></returns>

        public async Task<int> GetProjectCount()
        {
            return await _unitOfWork.ProjectRepository.GetProjectCount();
        }

        /// <summary>
        /// Retrieves a paginated list of all projects, including their associated client names and hourly rates.
        /// Returns a success response with <c>null</c> data and a count of 0 if no projects are found.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="search"></param>
        /// <returns></returns>

        public async Task<APIResponse<List<GetProjectsByClientIdDTO>>> GetAllProjects(int? page, int? limit, string? search)
        {
            var projects = await _unitOfWork.ProjectRepository.GetAll(page, limit, search);

            if (projects == null || projects.Count == 0)
                return APIResponse<List<GetProjectsByClientIdDTO>>.Ok(null,"Projects not found",0);

            int count = await _unitOfWork.ProjectRepository.GetProjectCount();

            var result = projects.Select(x => new GetProjectsByClientIdDTO
            {
                ProjectId = x.ProjectId.ToString(),
                ClientId = x.ClientId.ToString(),
                ProjectName = x.ProjectName,
                ClientName = x.Client.ClientName,
                HourlyRate = (double?)x.HourlyRate,
                IsActive = x.IsActive
            }).ToList();

            return APIResponse<List<GetProjectsByClientIdDTO>>.Ok(result, "All projects fetched successfully", count);
        }


        /// <summary>
        /// Activates or deactivates a project by updating its <c>IsActive</c> flag.
        /// Persists the change to the database after validating the project exists.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<APIResponse<bool>> UpdateProjectStatus(Guid id, bool status)
        {
            if (id == Guid.Empty)
                return APIResponse<bool>.Fail("Invalid project ID");

            var project = await _unitOfWork.ProjectRepository.GetById(id);
            if (project == null)
                return APIResponse<bool>.Fail("Project not found");

            project.IsActive = status;
            await _unitOfWork.Save();

            return APIResponse<bool>.Ok(true, "Project status updated successfully");
        }


        /// <summary>
        /// Retrieves a single project by its unique identifier, including its client name,
        /// hourly rate, and payment terms.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>


        public async Task<APIResponse<GetProjectsByClientIdDTO>> GetProjectById(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<GetProjectsByClientIdDTO>.Fail("Invalid project ID");

            var project = await _unitOfWork.ProjectRepository.GetById(id);
            if (project == null)
                return APIResponse<GetProjectsByClientIdDTO>.Fail("Project not found");

            var result = new GetProjectsByClientIdDTO
            {
                ProjectId = project.ProjectId.ToString(),
                ClientId = project.ClientId.ToString(),
                ProjectName = project.ProjectName,
                PaymentTerms = project.PaymentTerms,
                ClientName = project.Client.ClientName,
                HourlyRate = (double?)project.HourlyRate,
                IsActive = project.IsActive
            };

            return APIResponse<GetProjectsByClientIdDTO>.Ok(result, "Project fetched successfully");
        }


        /// <summary>
        /// Creates a new project record from the provided DTO and persists it to the database.
        /// Maps the input DTO to a <see cref="Project"/> entity and returns the created project as a DTO.
        /// Note: client name is not included in the returned DTO as the entity's navigation property
        /// is not loaded after creation.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<APIResponse<GetProjectsByClientIdDTO>> CreateProject(ProjectDTO dto)
        {
            if (dto == null)
                return APIResponse<GetProjectsByClientIdDTO>.Fail("Invalid project data");

            var project = _mapper.Map<Project>(dto);
            await _unitOfWork.ProjectRepository.Add(project);
            await _unitOfWork.Save();

            var result = new GetProjectsByClientIdDTO
            {
                ProjectId = project.ProjectId.ToString(),
                ClientId = project.ClientId.ToString(),
                ProjectName = project.ProjectName,
                HourlyRate = (double?)project.HourlyRate,
                IsActive = project.IsActive
            };

            return APIResponse<GetProjectsByClientIdDTO>.Ok(result, "Project created successfully");
        }


        /// <summary>
        /// Updates an existing project record with the data provided in the DTO.
        /// Maps the DTO onto the existing entity and persists the changes to the database.
        /// Client name is included in the returned DTO only if the navigation property is available
        /// on the updated entity.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>

        public async Task<APIResponse<GetProjectsByClientIdDTO>> UpdateProject(Guid id, ProjectDTO dto)
        {
            if (id == Guid.Empty || dto == null)
                return APIResponse<GetProjectsByClientIdDTO>.Fail("Invalid project data");

            var existing = await _unitOfWork.ProjectRepository.GetById(id);
            if (existing == null)
                return APIResponse<GetProjectsByClientIdDTO>.Fail("Project not found");

            _mapper.Map(dto, existing);

            var updated = await _unitOfWork.ProjectRepository.Update(existing);
            await _unitOfWork.Save();

            var result = new GetProjectsByClientIdDTO
            {
                ProjectId = updated.ProjectId.ToString(),
                ClientId = updated.ClientId.ToString(),
                ProjectName = updated.ProjectName,
                ClientName = updated.Client?.ClientName,
                HourlyRate = (double?)updated.HourlyRate,
                IsActive = updated.IsActive
            };

            return APIResponse<GetProjectsByClientIdDTO>.Ok(result, "Project updated successfully");
        }

        /// <summary>
        /// Deletes an existing project record from the database by its unique identifier.
        /// Returns the deleted project's ID on success.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        public async Task<APIResponse<Guid>> DeleteProject(Guid id)
        {
            if (id == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid project ID");

            var existing = await _unitOfWork.ProjectRepository.GetById(id);
            if (existing == null)
                return APIResponse<Guid>.Fail("Project not found");

            await _unitOfWork.ProjectRepository.Delete(existing);
            await _unitOfWork.Save();

            return APIResponse<Guid>.Ok(existing.ProjectId, "Project deleted successfully");
        }

    }
}
