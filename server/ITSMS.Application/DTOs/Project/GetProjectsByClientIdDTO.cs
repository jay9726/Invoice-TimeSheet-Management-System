

namespace ITSMS.Application.DTOs.Project
{
    public class GetProjectsByClientIdDTO
    {
        public string? ProjectId { get; set; }
        public string? ClientId { get; set; }
        public string? ProjectName { get; set; }
        public string? PaymentTerms { get; set; }
        public string? ClientName{ get; set; }
        public double? HourlyRate{ get; set; }
        public Boolean? IsActive{ get; set; }
    }
}

