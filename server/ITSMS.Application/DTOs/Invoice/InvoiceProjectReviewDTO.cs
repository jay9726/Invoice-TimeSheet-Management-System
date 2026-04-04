

namespace ITSMS.Application.DTOs.Invoice
{
    public class InvoiceProjectPreviewDto
    {
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? PaymentTerms { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public decimal TotalHours { get; set; }
        public decimal Rate { get; set; }

        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }

        public decimal Amount { get; set; }
    }


    public class ProjectInvoiceAggRow
    {
        public string? ProjectId { get; set; }
        public decimal TotalHours { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

}
