
namespace ITSMS.Application.DTOs.Report
{
    public class EmployeeMonthlyReportDTO
    {
        public Guid EmployeeId { get; set; }
        public string? EmployeeName { get; set; } 

        public int Month { get; set; }
        public int Year { get; set; }

        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public DateOnly? ActualStartDate { get; set; }
        public DateOnly? ActualEndDate { get; set; }

        public decimal TotalBillableHours { get; set; }

        public List<ClientProjectHourDTO> Items { get; set; } = new();
    }

}
