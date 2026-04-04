using ITSMS.Application.DTOs.Auth;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.IRepositories;
using ITSMS.Authentication.JWT.EmailService;
using ITSMS.Authentication.JWT.Template;
using ITSMS.Domain.Entities.Identity;
using System.Web;

namespace ITSMS.Authentication.JWT.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly IJwtTokenService _authorizationService;

        private readonly IAuthEmailTemplateService _templateService;
        private readonly IEmailService _email;


        public AuthService(IAuthRepository repo, IJwtTokenService authorizationService, IAuthEmailTemplateService templateService, IEmailService email)
        {
            _repo = repo;
            _authorizationService = authorizationService;
            _templateService = templateService;
            _email = email;
        }


        public async Task<(bool Success, AuthResponseDTO? Data, string Message)> LoginAsync(LoginDTO request)
        {
            var user = await _repo.FindByEmailAsync(request.Email!);
            if (user == null)
                return (false, null, "Email or Password Invalid");

            var ok = await _repo.CheckPasswordAsync(user, request.Password!);

            if (!ok)
                return (false, null, "Email or Password Invalid");

            var roles = await _repo.GetRolesAsync(user);

            var role = roles?.FirstOrDefault() ?? string.Empty;

            var token = _authorizationService.GenerateJwtToken(user.Email!, user.Id.ToString(), role);
            var expiresAt = DateTime.UtcNow.AddHours(1);

            var res = new AuthResponseDTO
            {
                Token = token,
                Id = user.Id.ToString(),
                Role = role
                //User = new AuthUserDTO
                //{
                //    Id = user.Id.ToString(),
                //    ExpiresAt = expiresAt.ToString("O"), 
                //    Email = user.Email ?? "",
                //    FullName = user.FullName ?? "",
                //    Role = role
                //}
            };
            return (true, res, "Login successful");
        }

        public async Task<GetEmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO request)
        {
            var existing = await _repo.FindByEmailAsync(request.Email!);
            if (existing != null)
                throw new Exception("Email already exists");

            var roleExists = await _repo.RoleExistsAsync(request.Role!);
            if (!roleExists)
                throw new Exception("Role does not exist");

            var user = new Employee
            {
                FullName = request.FullName ?? "",
                Email = request.Email,
                UserName = request.Email,
                EmailConfirmed = true
            };

            var createRes = await _repo.CreateUserAsync(user, request.Password!);
            if (!createRes.Succeeded)
                throw new Exception(string.Join(", ", createRes.Errors.Select(e => e.Description)));

            var roleRes = await _repo.AddToRoleAsync(user, request.Role!);
            if (!roleRes.Succeeded)
                throw new Exception(string.Join(", ", roleRes.Errors.Select(e => e.Description)));

            var createdEmployee = new GetEmployeeDTO
            {
                EmployeeId = user.Id.ToString(),
                Email = user.Email,
                FullName = user.FullName,
                IsActive = user.IsActive
            };

            return createdEmployee;
        }



        public async Task ForgotPasswordAsync(ForgotPasswordDTO request, string resetBaseUrl)
        {
            var user = await _repo.FindByEmailAsync(request.Email!);

            if (user == null)
                return;

            var token = await _repo.GeneratePasswordResetTokenAsync(user);


            var encodedToken = HttpUtility.UrlEncode(token);
            var encodedEmail = HttpUtility.UrlEncode(request.Email);


            var link = $"{resetBaseUrl}?email={encodedEmail}&token={encodedToken}";

            var subject = "Reset Your Password";
            var body = _templateService.BuildResetPasswordEmail(userEmail: request.Email!, resetLink: link);


            await _email.SendEmailAsync(request.Email!, subject, body);
        }





        public async Task ResetPasswordAsync(ResetPasswordDTO request)
        {
            var user = await _repo.FindByEmailAsync(request.Email!);
            if (user == null)
                throw new Exception("Invalid request");


            var res = await _repo.ResetPasswordAsync(user, request.Token!, request.NewPassword!);
            if (!res.Succeeded)
                throw new Exception(string.Join(", ", res.Errors.Select(e => e.Description)));
        }





        public async Task ChangePasswordAsync(string userId, ChangePasswordDTO request)
        {
            var user = await _repo.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            var res = await _repo.ChangePasswordAsync(user, request.OldPassword!, request.NewPassword!);
            if (!res.Succeeded)
                throw new Exception(string.Join(", ", res.Errors.Select(e => e.Description)));
        }

        public Task LogoutAsync() => _repo.SignOutAsync();


        public async Task<string> GetManagerEmailAsycn()
        {
            return await _repo.GetManagerEmailAsync();
        }
        public async Task<string> GetAccountUserEmailAsycn()
        {
            return await _repo.GetAccountUserEmailAsync();
        }


    }
}
