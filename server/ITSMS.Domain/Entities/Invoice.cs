using ITSMS.Domain.Entities.Identity;
using ITSMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;


namespace ITSMS.Domain.Entities
{
    public class Invoice
    {
        [Key]
        public Guid InvoiceId { get; set; }

        public string InvoiceNumber { get; set; } = string.Empty;

        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public Guid ClientId { get; set; }
        public Client Client { get; set; } = default!;

        public DateOnly InvoiceDate { get; set; }
        public string? PONumber { get; set; }
        public string? PaymentTerms { get; set; }
        public decimal TotalAmount { get; set; }

        public InvoiceStatus? Status { get; set; } = InvoiceStatus.DRAFT;

        public DateOnly CreatedDate { get; set; } = new DateOnly();

        public Guid CreatedBy { get; set; }
        public Employee CreatedByUser { get; set; } = default!;

        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    }
}
