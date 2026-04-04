

namespace ITSMS.Application.DTOs.Client
{
    public class GetClientWithProjectsDto
    {
        public string? ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? ContactNumber { get; set; }
        public bool IsActive { get; set; }

        public List<ProjectListDto> Projects { get; set; } = new();
    }
    public class ProjectListDto
    {
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsActive { get; set; }
    }

}
