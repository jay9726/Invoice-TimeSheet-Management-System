using ITSMS.Application.DTOs.Dashboard;

namespace ITSMS.Application.IServices
{
    public interface IDashboardService
    {
        Task<AdminDashboardDTO> GetAdminDashboard();
        Task<AccountUserDashboardDTO> GetAccountUserDashboard();
        Task<ManagerDashboardDTO> GetManagerDashboard();
        Task<EmployeeDashboardDTO> GetEmployeeDashboard(Guid empid);
    }
}
