using ITSMS.Application.DTOs.Auth;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Authentication.JWT.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        private readonly IConfiguration _config;

        public AuthController(IAuthService service,IConfiguration config)
        {
            _service = service;
            _config = config;
        }


        /// <summary>
        /// Authenticates a user with their credentials and returns a JWT token on success.
        /// This endpoint is publicly accessible and does not require authorization.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            var (success, data, message) = await _service.LoginAsync(request);

            if (!success)
                return Unauthorized(new { message }); 

            return Ok(data);
        }


        /// <summary>
        /// Creates a new employee user account.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost("create-user")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDTO request)
        {
            var res = await _service.CreateEmployeeAsync(request);
            return Ok(new { Message = "User created successfully", Data =res });
        }

        /// <summary>
        /// Initiates the password reset flow by sending a reset link to the user's registered email address.
        /// The reset link is constructed using the base URL configured in <c>Frontend:ResetPasswordUrl</c>.
        /// This endpoint is publicly accessible and does not require authorization.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO request)
        {
            var resetBaseUrl = _config["Frontend:ResetPasswordUrl"];

            await _service.ForgotPasswordAsync(request, resetBaseUrl);

            return Ok(new { Message = "Reset link has been sent." });
        }


        /// <summary>
        /// Resets a user's password using a valid password reset token.
        /// This endpoint is publicly accessible and does not require authorization.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO request)
        {
            await _service.ResetPasswordAsync(request);
            return Ok(new { Message = "Password reset successfully" });
        }

        /// <summary>
        /// Allows an authenticated user to change their own password.
        /// The user's ID is extracted from the JWT claims rather than being passed explicitly in the request.
        /// Requires a valid authorization token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            await _service.ChangePasswordAsync(userId, request);
            return Ok(new { Message = "Password changed successfully" });
        }

        /// <summary>
        /// Logs out the currently authenticated user by invalidating their session or token.
        /// Requires a valid authorization token.
        /// </summary>
        /// <returns></returns>

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _service.LogoutAsync();
            return Ok(new { Message = "Logged out successfully" });
        }
    }
}
