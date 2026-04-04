
namespace ITSMS.Application.DTOs.TimeEntry
{
    public class TimeEntryResponseDTO
    {
        public string? TimeEntryId { get; set; }
        public string? TimesheetId { get; set; }
        public string? ClientName { get; set; }
        public string? ProjectName { get; set; }
        public string? TaskName { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public DateOnly WorkDate { get; set; }
        public string? HoursWorked { get; set; }
        public bool IsBillable { get; set; }
        public string? Notes { get; set; }
    }
}
