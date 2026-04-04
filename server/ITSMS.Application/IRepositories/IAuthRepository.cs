using ITSMS.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace ITSMS.Application.IRepositories
{
    public interface IAuthRepository
    {
        Task<Employee?> FindByEmailAsync(string email);
        Task<Employee?> FindByIdAsync(string userId);
        Task<bool> CheckPasswordAsync(Employee user, string password);
        Task<IdentityResult> CreateUserAsync(Employee user, string password);
        Task<bool> RoleExistsAsync(string role);
        Task<IdentityResult> AddToRoleAsync(Employee user, string role);
        Task<List<string>> GetRolesAsync(Employee user);
        Task<IdentityResult> RemoveFromRolesAsync(Employee employee, IEnumerable<string> roles);
        Task<string> GeneratePasswordResetTokenAsync(Employee user);
        Task<IdentityResult> ResetPasswordAsync(Employee user, string token, string newPassword);
        Task<IdentityResult> ChangePasswordAsync(Employee user, string oldPassword, string newPassword);
        Task SignOutAsync();

        Task<string> GetManagerEmailAsync();
        Task<string> GetAccountUserEmailAsync();
    }
}
