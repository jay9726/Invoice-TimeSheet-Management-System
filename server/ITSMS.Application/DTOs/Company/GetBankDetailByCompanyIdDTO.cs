namespace ITSMS.Application.DTOs.Company
{
    public class GetBankDetailByCompanyIdDTO
    {
        public string? CompanyId { get; set; }
        public string? BankName { get; set; }
        public string? SwiftCode { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNumber { get; set; }
        public string? RoutingNumber { get; set; }
        public bool IsActive { get; set; } = true;
        public string? CompanyName { get; set; }
    }
}
