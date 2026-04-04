namespace ITSMS.Application.DTOs.Client
{
    public class GetProjectsByClientIdDTO
    {
        public string? ClientId { get; set; }
        public string? ProjectName { get; set; }
        public decimal? HourlyRate { get; set; }
        public string? IsActive { get; set; }
        public string? ClientName { get; set; }
    }
}
