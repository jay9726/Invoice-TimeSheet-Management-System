using ITSMS.Domain.Entities.Identity;
using ITSMS.Domain.Enum;

namespace ITSMS.Domain.Entities
{
    public class TimeSheet
    {
        public Guid TimesheetId { get; set; }


        public Guid? UserId { get; set; }
        public Employee User { get; set; } = default!;

        public DateOnly WeekStartDate { get; set; }

        public TimeSheetStatus Status { get; set; } = TimeSheetStatus.DRAFT; 

        public DateTime? SubmittedOn { get; set; }
        public DateTime? ApprovedOn { get; set; }

        public Guid? ApprovedBy { get; set; }
        public Employee? ApprovedByUser { get; set; }

        public string? Comments { get; set; }

        public ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
    }
}
