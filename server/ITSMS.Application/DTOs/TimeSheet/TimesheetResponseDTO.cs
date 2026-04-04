
namespace ITSMS.Application.DTOs.TimeSheet
{
    public class TimesheetResponseDTO
    {
        public string? TimesheetId { get; set; }
        public DateOnly WeekStartDate { get; set; }
        public string? Status { get; set; }
        public decimal TotalHours { get; set; }
    }
}
