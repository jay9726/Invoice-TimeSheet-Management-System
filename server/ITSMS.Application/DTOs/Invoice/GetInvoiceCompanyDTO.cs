
namespace ITSMS.Application.DTOs.Invoice
{
    public class GetInvoiceCompanyDTO
    {
        public string? CompanyId { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CompanyName { get; set; }
        public string? AddressLine1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; } = true;

        public int ClientCount { get; set; }
    }
}
