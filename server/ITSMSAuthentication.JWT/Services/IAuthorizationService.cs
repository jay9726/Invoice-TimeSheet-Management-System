

namespace ITSMS.Authentication.JWT.Services
{
    public interface IJwtTokenService
    {
        string GenerateJwtToken(string email, string employeeId, string role);

    }
}
