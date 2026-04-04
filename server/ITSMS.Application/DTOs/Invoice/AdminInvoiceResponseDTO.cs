
namespace ITSMS.Application.DTOs.Invoice
{
    public class AdminInvoiceResponseDTO
    {
        public string? InvoiceId { get; set; }
        public string? CompanyId { get; set; }
        public string? ClientId { get; set; }
        public string? ClientName { get; set; }
        public double ? TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? InvoiceDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? PONumber { get; set; }
    }
}
