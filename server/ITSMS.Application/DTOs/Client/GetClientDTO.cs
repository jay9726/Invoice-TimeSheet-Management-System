

namespace ITSMS.Application.DTOs.Client
{
    public class GetClientDTO
    {
        public string? CompanyId { get; set; }
        public string? ClientId { get; set; }
        public string? CompanyName { get; set; }
        public string? ClientName { get; set; }
        public string? ContactNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
