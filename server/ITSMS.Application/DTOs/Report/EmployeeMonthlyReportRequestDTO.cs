

namespace ITSMS.Application.DTOs.Report
{
    public class EmployeeMonthlyReportRequestDTO
    {
        public string? EmployeeId { get; set; }
        public int Month { get; set; }  
        public int? Year { get; set; }
    }
}
