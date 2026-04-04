
namespace ITSMS.Application.DTOs.Email_Service
{
    public class DecisionTimeSheetEmail
    {
        public string? TimeSheetName { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeEmail { get; set; }
        public DateTime? ActionDate { get; set; }
        public string? ManagerComment { get; set; }
        public string? Status { get; set; }
        public string? ActionBy { get; set; }
    }
}
