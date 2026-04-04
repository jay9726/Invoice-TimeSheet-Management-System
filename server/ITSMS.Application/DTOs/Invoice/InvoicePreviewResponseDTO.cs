
namespace ITSMS.Application.DTOs.Invoice
{
    public class InvoicePreviewResponseDto
    {
        public CompanyHeaderDto Company { get; set; } = new();
        public ClientBillToDto BillTo { get; set; } = new();
        public BankDetailDto? BankDetails { get; set; }

        public List<InvoiceProjectPreviewDto> Projects { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public string? PaymentTerms { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? PONumber { get; set; }

    }



    public class CompanyHeaderDto
    {
        public string? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? companyLogo { get; set; }
        public string? AddressLine1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
    }

    public class ClientBillToDto
    {
        public string? ClientId { get; set; }
        public string? ClientName { get; set; }  
        public string? ContactNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
    }

    public class BankDetailDto
    {
        public string? BankDetailId { get; set; }
        public string? BankName { get; set; } 
        public string? SwiftCode { get; set; } 
        public string? AccountName { get; set; } 
        public string? AccountNumber { get; set; } 
        public string? RoutingNumber { get; set; } 
    }
}
