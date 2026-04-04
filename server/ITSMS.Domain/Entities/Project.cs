using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class Project
    {
        [Key]
        public Guid ProjectId { get; set; }
        public Guid ClientId { get; set; }
        public string? ProjectName { get; set; }
        public string? PaymentTerms { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsActive { get; set; } = true;

        public Client? Client { get; set; }
    }
}
