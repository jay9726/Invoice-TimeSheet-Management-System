using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.Client
{
    public class ClientDTO
    {
        [Required(ErrorMessage = "Client name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Client name must be between 2 and 100 characters")]
        public string ClientName { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid contact number")]
        [StringLength(20, ErrorMessage = "Contact number cannot exceed 20 characters")]
        public string? ContactNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string AddressLine1 { get; set; } = string.Empty;

        [Required(ErrorMessage = "Company is required")]
        public string CompanyId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
        public string Country { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "State cannot exceed 100 characters")]
        public string? State { get; set; }

        [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
        public string? City { get; set; }

        public string? Zip { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
