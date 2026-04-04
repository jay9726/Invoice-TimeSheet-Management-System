
namespace ITSMS.Application.DTOs.Email_Service
{
    public class SubmitTimeSheetEmail
    {
        public string? EmployeeName { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public string? EmployeeEmail { get; set; }
    }
}
