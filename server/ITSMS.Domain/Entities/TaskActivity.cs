using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class TaskActivity
    {
        [Key]
        public Guid TaskActivityId { get; set; }
        public string? TaskName { get; set; }
        public bool IsBillableDefault { get; set; } = true;
    }
}
