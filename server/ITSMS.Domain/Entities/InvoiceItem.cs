using System.ComponentModel.DataAnnotations;

namespace ITSMS.Domain.Entities
{
    public class InvoiceItem
    {

        [Key]
        public Guid InvoiceItemId { get; set; }
        public Guid InvoiceId { get; set; }
        public Guid ProjectId { get; set; }
        public Invoice Invoice { get; set; } = default!;
        public decimal Quantity { get; set; }
        public string? Description { get; set; } 
        public decimal Rate { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public decimal Amount { get; set; }
    }
}
