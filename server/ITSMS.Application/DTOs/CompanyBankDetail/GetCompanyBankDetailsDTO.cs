
namespace ITSMS.Application.DTOs.CompanyBankDetail
{
    public class GetCompanyBankDetailsDTO
    {
        public string? BankDetailId { get; set; }
        public string? CompanyId { get; set; }
        public string? BankName { get; set; }
        public string? SwiftCode { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public string? RoutingNumber { get; set; }
        public bool IsActive { get; set; }
    }
}
