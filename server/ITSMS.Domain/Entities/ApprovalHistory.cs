using ITSMS.Domain.Entities.Identity;
using ITSMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class ApprovalHistory
    {
        [Key]
        public Guid ApprovalId { get; set; }

        public Guid TimesheetId { get; set; }
        public TimeSheet Timesheet { get; set; } = default!;

        public TimeSheetStatus Action { get; set; }  
        public Guid ActionBy { get; set; }                  
        public Employee ActionByUser { get; set; } = default!;

        public DateTime ActionDate { get; set; } = DateTime.UtcNow;
        public string? Remarks { get; set; }
    }
}
