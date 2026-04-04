
namespace ITSMS.Domain.Entities
{
    public class TimeEntry
    {
        public Guid TimeEntryId { get; set; }

        public Guid TimesheetId { get; set; }
        public TimeSheet? Timesheet { get; set; } 

        public DateOnly WorkDate { get; set; }

        public Guid ClientId { get; set; }
        public Client? Clients { get; set; } 

        public Guid ProjectId { get; set; }
        public Project? Projects { get; set; }

        public Guid TaskId { get; set; }
        public TaskActivity? TaskActivities { get; set; }

        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public decimal HoursWorked { get; set; }

        public bool IsBillable { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedOn { get; set; }
    }
}
