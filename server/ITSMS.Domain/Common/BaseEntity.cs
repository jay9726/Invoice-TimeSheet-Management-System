namespace ITSMS.Domain.Common
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset? DateUpdated { get; set; }
        public required string CreatedBy { get; set; }
        public required string LastModifiedBy { get; set; }

    }
}
