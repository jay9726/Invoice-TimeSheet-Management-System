
namespace ITSMS.Application.DTOs.Auth
{
    public class AuthResponseDTO
    {
        public string? Token { get; set; }

        public string Id { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}

