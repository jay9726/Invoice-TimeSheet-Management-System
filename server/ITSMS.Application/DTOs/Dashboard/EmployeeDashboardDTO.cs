
namespace ITSMS.Application.DTOs.Dashboard
{
    public class EmployeeDashboardDTO
    {
        public int TotalTimeSheets { get; set; }
        public int TotalWorkedHours { get; set; }
        public int TotalBillableHours { get; set; }
        public int TotalDraftTimeSheets { get; set; }
        public int TotalSubmittedTimeSheets { get; set; }
        public int TotalApprovedTimeSheets { get; set; }
        public int TotalRejectedTimeSheets { get; set; }
        public int ThisMonthTotalTimesheets { get; set; }
        public int ThisMonthBillableHours { get; set; }
    }
}
