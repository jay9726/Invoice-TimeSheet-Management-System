using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ITSMS.Application.DTOs.Company
{
    public class GetCompanyDTO
    {
        public string CompanyId { get; set; } = string.Empty;

        public string? CompanyLogo { get; set; }

        [Required(ErrorMessage = "Company name is required")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Company name must be between 2 and 150 characters")]
        public string CompanyName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string AddressLine1 { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
        public string? City { get; set; }

        [StringLength(100, ErrorMessage = "State cannot exceed 100 characters")]
        public string? State { get; set; }

        public string? Zip { get; set; }

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
        public string Country { get; set; } = string.Empty;

        public bool IsActive { get; set; } 
    }
}
