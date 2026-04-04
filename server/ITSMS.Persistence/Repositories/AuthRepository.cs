using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace ITSMS.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<Employee> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<Employee> _signInManager;

    

        public AuthRepository(RoleManager<Role> roleManager, SignInManager<Employee> signInManager, UserManager<Employee> userManager)
        {
            _roleManager = roleManager;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<Employee?> FindByEmailAsync(string email) => await _userManager.FindByEmailAsync(email);

        public async Task<Employee?> FindByIdAsync(string userId) =>await _userManager.FindByIdAsync(userId);

        public async Task<bool> CheckPasswordAsync(Employee employee, string password) => await _userManager.CheckPasswordAsync(employee, password);

        public async Task<IdentityResult> CreateUserAsync(Employee employee, string password) => await _userManager.CreateAsync(employee, password);

        public async Task<bool> RoleExistsAsync(string role) => await _roleManager.RoleExistsAsync(role);

        public async Task<IdentityResult> AddToRoleAsync(Employee employee, string role) => await _userManager.AddToRoleAsync(employee, role);

        public async Task<List<string>> GetRolesAsync(Employee employee)
        {
            var roles = await _userManager.GetRolesAsync(employee); 
            return roles.ToList(); 
        }

        public async Task<IdentityResult> RemoveFromRolesAsync(Employee employee, IEnumerable<string> roles)
    => await _userManager.RemoveFromRolesAsync(employee, roles);

        public async Task<string> GeneratePasswordResetTokenAsync(Employee employee) => await _userManager.GeneratePasswordResetTokenAsync(employee);

        public async Task<IdentityResult> ResetPasswordAsync(Employee employee, string token, string newPassword) => await _userManager.ResetPasswordAsync(employee, token, newPassword);

        public async Task<IdentityResult> ChangePasswordAsync(Employee employee, string oldPassword, string newPassword) => await _userManager.ChangePasswordAsync(employee, oldPassword, newPassword);

        public async Task SignOutAsync() => await _signInManager.SignOutAsync();


        public async Task<string> GetManagerEmailAsync()
        {
            var managerRole = await _roleManager.FindByNameAsync("Manager");
            if (managerRole == null) return null;

            var usersInRole = await _userManager.GetUsersInRoleAsync("Manager");
            var manager = usersInRole.FirstOrDefault();

            return manager?.Email!;
        }
        public async Task<string> GetAccountUserEmailAsync()
        {
            var managerRole = await _roleManager.FindByNameAsync("AccountUser");
            if (managerRole == null) return null;

            var usersInRole = await _userManager.GetUsersInRoleAsync("AccountUser");
            var manager = usersInRole.FirstOrDefault();

            return manager?.Email!;
        }

    }
}