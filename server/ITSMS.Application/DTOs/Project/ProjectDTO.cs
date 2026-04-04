using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.Project
{
    public class ProjectDTO
    {
        [Required(ErrorMessage = "Client is required")]
        public string ClientId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Project name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Project name must be between 2 and 200 characters")]
        public string ProjectName { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Payment terms cannot exceed 500 characters")]
        public string? PaymentTerms { get; set; }

        [Range(0.01, 100000.00, ErrorMessage = "Hourly rate must be between 0.01 and 100,000")]
        public decimal HourlyRate { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
