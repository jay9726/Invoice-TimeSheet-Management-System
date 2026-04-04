using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class CompanyBankDetail
    {
        [Key]
        public Guid BankDetailId { get; set; }
        public Guid CompanyId { get; set; }
        public string? BankName { get; set; }
        public string? SwiftCode { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public string? RoutingNumber { get; set; }
        public bool IsActive { get; set; } = true;

        public Company? Company { get; set; }
    }
}
