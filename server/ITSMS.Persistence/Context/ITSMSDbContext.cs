using ITSMS.Domain.Entities;
using ITSMS.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ITSMS.Persistence.Context
{
    public class ITSMSDbContext : IdentityDbContext<Employee, Role, Guid>
    {
        public ITSMSDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskActivity> TaskActivities { get; set; }
        public DbSet<CompanyBankDetail> CompanyBankDetails { get; set; }
        public DbSet<TimeSheet> Timesheets { get; set; }
        public DbSet<TimeEntry> TimeEntries { get; set; }
        public DbSet<ApprovalHistory> ApprovalHistories { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }





        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Invoice>()
                    .Property(x => x.Status)
                    .HasConversion<string>();

            builder.Entity<TimeSheet>()
                    .Property(x => x.Status)
                    .HasConversion<string>();


            builder.Entity<Project>()
                    .Property(p => p.HourlyRate)
                    .HasPrecision(18, 2);


            builder.Entity<Client>()
                    .HasOne(c => c.Companies)
                    .WithMany()
                    .HasForeignKey(c => c.CompanyId)
                    .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Invoice>(e =>
            {
                e.HasKey(x => x.InvoiceId);
                e.Property(x => x.TotalAmount).HasPrecision(18, 2);
                e.HasIndex(x => x.InvoiceNumber).IsUnique();

                e.HasOne(x => x.Company)
                .WithMany()
                .HasForeignKey(x => x.CompanyId)
                .HasPrincipalKey(c => c.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Client)
                .WithMany()
                .HasForeignKey(x => x.ClientId)
                .HasPrincipalKey(c => c.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasMany(x => x.Items)
                .WithOne(i => i.Invoice)
                .HasForeignKey(i => i.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
            });



            builder.Entity<InvoiceItem>(e =>
            {
                e.HasKey(x => x.InvoiceItemId);
                e.Property(x => x.Quantity).HasPrecision(18, 2);
                e.Property(x => x.Rate).HasPrecision(18, 2);
                e.Property(x => x.Amount).HasPrecision(18, 2);
            });




            builder.Entity<TimeEntry>(e =>
            {
                e.HasOne(x => x.Clients)
                .WithMany()
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Projects)
                .WithMany()
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.TaskActivities)
                .WithMany()
                .HasForeignKey(x => x.TaskId)
                .OnDelete(DeleteBehavior.Restrict);
            });



            builder.Entity<TimeSheet>(e =>
            {
                e.HasKey(x => x.TimesheetId);

                e.HasOne(x => x.User)
                 .WithMany()
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.ApprovedByUser)
                 .WithMany()
                 .HasForeignKey(x => x.ApprovedBy)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => new { x.UserId, x.WeekStartDate }).IsUnique();
            });

            builder.Entity<ApprovalHistory>(e =>
            {
                e.HasKey(x => x.ApprovalId);

                e.HasOne(x => x.Timesheet)
                 .WithMany()
                 .HasForeignKey(x => x.TimesheetId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.ActionByUser)
                 .WithMany()
                 .HasForeignKey(x => x.ActionBy)
                 .OnDelete(DeleteBehavior.Restrict);
            });



            var adminRoleId = Guid.Parse("9b1c5c87-9e42-4f83-9d6c-1c7e2a1b4f11");
            var accountUserRoleId = Guid.Parse("2f7e91a4-6c83-41a5-8b93-94c3e2d7a111");
            var managerRoleId = Guid.Parse("7a8c6f21-3b12-4d99-bcb0-3f8a2d5e9c44");
            var employeeRoleId = Guid.Parse("d4f1c9e8-5b33-4c2d-92f1-71e4a88b6d22");



            builder.Entity<Role>().HasData(
              new Role
              {
                  Id = adminRoleId,
                  Name = "Admin",
                  NormalizedName = "ADMIN",
                  ConcurrencyStamp = "d3f1a2b4-11c0-4e8a-9f7d-2c3e5a6b8d90"
              },
              new Role
              {
                  Id = accountUserRoleId,
                  Name = "AccountUser",
                  NormalizedName = "ACCOUNTUSER",
                  ConcurrencyStamp = "a9c7e1f3-22b4-4d6a-8e0c-1f3a5b7d9e21"
              },
              new Role
              {
                  Id = managerRoleId,
                  Name = "Manager",
                  NormalizedName = "MANAGER",
                  ConcurrencyStamp = "b5d2f8a1-33e6-4c7b-9a1d-4e6c8f0a2b43"
              },
              new Role
              {
                  Id = employeeRoleId,
                  Name = "Employee",
                  NormalizedName = "EMPLOYEE",
                  ConcurrencyStamp = "c1e4a6b8-44f7-4d8c-0b2e-5f7a9c1d3e65"
              }
          );
        }
    }
}
