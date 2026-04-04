using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class Company
    {
        [Key]
        public Guid CompanyId { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyName { get; set; }
        public string? AddressLine1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
