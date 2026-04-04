
using ITSMS.Application.DTOs.Dashboard;

namespace ITSMS.Application.IRepositories
{
    public interface IDashboardRepository
    {
        Task<AdminDashboardDTO> GetAdminDashboardAsync();
        Task<AccountUserDashboardDTO> GetAccountUserDashboardAsync();
        Task<ManagerDashboardDTO> GetManagerDashboardAsync();
        Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(Guid empId);
    }
}
