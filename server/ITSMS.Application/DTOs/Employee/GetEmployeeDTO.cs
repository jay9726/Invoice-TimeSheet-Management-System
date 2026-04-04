
namespace ITSMS.Application.DTOs.Employee
{
    public class GetEmployeeDTO
    {
        public string? EmployeeId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}
