using ITSMS.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITSMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Retrieves aggregated dashboard data for admin users,
        /// such as system-wide statistics and company-level overviews.
        /// Restricted to users with the Admin role.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Admin")]
        [HttpGet("AdminDashboard")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var res = await _dashboardService.GetAdminDashboard();
            return Ok(res);
        }

        /// <summary>
        /// Retrieves aggregated dashboard data for account users,
        /// such as invoice summaries and billing-related statistics.
        /// Restricted to users with the AccountUser role.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "AccountUser")]
        [HttpGet("AccountUserDashboard")]
        public async Task<IActionResult> GetAccountUserDashboard()
        {
            var res = await _dashboardService.GetAccountUserDashboard();
            return Ok(res);
        }

        /// <summary>
        /// Retrieves aggregated dashboard data for managers,
        /// such as team performance summaries and project status overviews.
        /// Restricted to users with the Manager role.
        /// </summary>
        /// <returns></returns>

        [Authorize(Roles = "Manager")]
        [HttpGet("ManagerDashboard")]
        public async Task<IActionResult> GetManagerDashboard()
        {
            var res = await _dashboardService.GetManagerDashboard();
            return Ok(res);
        }

        /// <summary>
        /// Retrieves aggregated dashboard data for a specific employee,
        /// such as assigned tasks, logged hours, and project activity.
        /// Restricted to users with the Employee role.
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns></returns>

        [Authorize(Roles = "Employee")]
        [HttpGet("EmployeeDashboard")]
        public async Task<IActionResult> GetEmployeeDashboard(Guid employeeId)
        {
            var res = await _dashboardService.GetEmployeeDashboard(employeeId);
            return Ok(res);
        }

    }
}
