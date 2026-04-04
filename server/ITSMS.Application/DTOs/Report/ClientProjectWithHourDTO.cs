
namespace ITSMS.Application.DTOs.Report
{
    public class ClientProjectHourDTO
    {
        public string? ClientId { get; set; }
        public string? ClientName { get; set; } 

        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; } 

        public decimal BillableHours { get; set; }
    }
}