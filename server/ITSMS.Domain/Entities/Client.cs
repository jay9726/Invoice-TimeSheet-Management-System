using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class Client
    {
        [Key]
        public Guid ClientId { get; set; }
        public Guid CompanyId { get; set; }
        public string? ClientName { get; set; }
        public string? ContactNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public bool IsActive { get; set; } = true;
        public Company? Companies { get; set; }
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
