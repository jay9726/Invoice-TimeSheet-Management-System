using System.ComponentModel.DataAnnotations;

namespace ITSMS.Application.DTOs.TimeEntry
{
    public class CreateTimeEntryDTO
    {
        [Required(ErrorMessage = "Work date is required")]
        public DateOnly WorkDate { get; set; }

        [Required(ErrorMessage = "Client is required")]
        public string ClientId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Project is required")]
        public string ProjectId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Task/Activity name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Task name must be between 2 and 200 characters")]
        public string TaskActivityName { get; set; } = string.Empty;

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        [Range(0.00, 100000000.0, ErrorMessage = "Hours worked must be between 0.00 and 100000000.0")]
        public decimal HoursWorked { get; set; }

        public bool IsBillable { get; set; }

        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }

    }
}
