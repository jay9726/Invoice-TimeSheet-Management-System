
namespace ITSMS.Application.DTOs.TaskActivity
{
    public class CreateTaskActivityDTO
    {
        public string? TaskActivityName { get; set; }
        public bool IsBillableDefault { get; set; } = true;
    }
}
