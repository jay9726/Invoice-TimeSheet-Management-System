

namespace ITSMS.Application.DTOs.Email_Service
{
    public class AccountUserApprovedEmail
    {
        public string? ManagerName { get; set; }
        public string? UserName { get; set; }
        public string? TimesheetName { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}
