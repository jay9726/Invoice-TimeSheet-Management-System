
namespace ITSMS.Application.DTOs.Dashboard
{
    public class ManagerDashboardDTO
    {
        public int TotalEmployees { get; set; }
        public int TotalClients { get; set; }
        public int TotalProjects { get; set; }
        public int TotalPendingTimesheets { get; set; }
        public int TotalApprovedTimesheets { get; set; }
        public int TotalRejectedTimesheets { get; set; }
    }
}
