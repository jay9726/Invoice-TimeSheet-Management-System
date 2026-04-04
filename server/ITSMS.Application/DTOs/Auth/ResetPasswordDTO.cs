

using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.Auth
{
    public class ResetPasswordDTO
    {
        public string? Token { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string? Email { get; set; }


        [Required(ErrorMessage = "New password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string? NewPassword { get; set; }
    }
}
