

using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.Auth
{
    public class ChangePasswordDTO
    {

        [Required(ErrorMessage = "Old password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string? OldPassword { get; set; }



        [Required(ErrorMessage = "New password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string? NewPassword { get; set; }

    }
}

