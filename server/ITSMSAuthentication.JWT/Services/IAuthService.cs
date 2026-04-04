using ITSMS.Application.DTOs.Auth;
using ITSMS.Application.DTOs.Employee;

namespace ITSMS.Authentication.JWT.Services
{
    public interface IAuthService
    {
        Task<(bool Success, AuthResponseDTO? Data, string Message)>  LoginAsync(LoginDTO request);

        Task<GetEmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO request); 

        Task ForgotPasswordAsync(ForgotPasswordDTO request, string resetBaseUrl);
        Task ResetPasswordAsync(ResetPasswordDTO request);

        Task ChangePasswordAsync(string userId, ChangePasswordDTO request);

        Task LogoutAsync();

        Task<string> GetManagerEmailAsycn();
        Task<string> GetAccountUserEmailAsycn();
    }
}
