

namespace ITSMS.Application.DTOs.TimeSheet
{
    public class TimesheetApprovalRequestDTO
    {
        public Guid EmployeeId { get; set; }
        public Guid TimesheetId { get; set; }
        public string? Action { get; set; }
        public string? Comment { get; set; }
    }
}
