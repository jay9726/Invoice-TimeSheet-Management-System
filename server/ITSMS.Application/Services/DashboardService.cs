using ITSMS.Application.DTOs.Dashboard;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;

namespace ITSMS.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        /// <summary>
        /// Retrieves aggregated dashboard data for admin users,
        /// such as system-wide statistics and company-level overviews.
        /// </summary>
        /// <returns></returns>
        public Task<AdminDashboardDTO> GetAdminDashboard()
            => _unitOfWork.DashboardRepository.GetAdminDashboardAsync();

        /// <summary>
        /// Retrieves aggregated dashboard data for account users,
        /// such as invoice summaries and billing-related statistics.
        /// </summary>
        /// <returns></returns>
        public Task<AccountUserDashboardDTO> GetAccountUserDashboard()
            => _unitOfWork.DashboardRepository.GetAccountUserDashboardAsync();

        /// <summary>
        /// Retrieves aggregated dashboard data for managers,
        /// such as team performance summaries and project status overviews.
        /// </summary>
        /// <returns></returns>
        public Task<ManagerDashboardDTO> GetManagerDashboard()
            => _unitOfWork.DashboardRepository.GetManagerDashboardAsync();


        /// <summary>
        /// Retrieves aggregated dashboard data for a specific employee,
        /// such as assigned tasks, logged hours, and project activity.
        /// </summary>
        /// <param name="empId"></param>
        /// <returns></returns>
        public Task<EmployeeDashboardDTO> GetEmployeeDashboard(Guid empId)
            => _unitOfWork.DashboardRepository.GetEmployeeDashboardAsync(empId);


    }
}
