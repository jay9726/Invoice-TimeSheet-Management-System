using Microsoft.AspNetCore.Identity;

namespace ITSMS.Domain.Entities.Identity
{
    public class Employee : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
