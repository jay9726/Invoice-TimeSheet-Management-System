

using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.Auth
{
    public class ForgotPasswordDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string? Email { get; set; }
    }
}
