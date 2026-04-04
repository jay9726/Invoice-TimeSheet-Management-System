using ITSMS.Domain.Enum;


namespace ITSMS.Application.DTOs.Invoice
{

    public class ClientMiniDto
    {
        public string? ClientId { get; set; }
        public string? CompanyId { get; set; }
        public string? ClientName { get; set; } 
        public bool? IsActive { get; set; }

        public string? InvoiceStatus { get; set; }
    }



    public class SubmitInvoiceResponseDto
    {
        public bool IsCreated { get; set; }
        public string? InvoiceId { get; set; }
        public string? InvoiceNumber { get; set; } 
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateInvoiceStatusRequestDto
    {
        public InvoiceStatus Status { get; set; }
    }
}
