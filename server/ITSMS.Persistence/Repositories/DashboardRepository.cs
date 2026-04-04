using ITSMS.Application.DTOs.Dashboard;
using ITSMS.Application.IRepositories;
using ITSMS.Domain.Enum;
using ITSMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ITSMS.Persistence.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ITSMSDbContext _db;

        public DashboardRepository(ITSMSDbContext db)
        {
            _db = db;
        }


        public async Task<AdminDashboardDTO> GetAdminDashboardAsync()
        {
            var users = await _db.Users
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(x => x.IsActive)
                })
                .FirstOrDefaultAsync();

            var companies = await _db.Companies
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(x => x.IsActive)
                })
                .FirstOrDefaultAsync();

            var projects = await _db.Projects
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(x => x.IsActive)
                })
                .FirstOrDefaultAsync();

            var banks = await _db.CompanyBankDetails
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(x => x.IsActive)
                })
                .FirstOrDefaultAsync();

            var clients = await _db.Clients
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(x => x.IsActive)
                })
                .FirstOrDefaultAsync();

            var invoices = await _db.Invoices
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Generated = g.Count(x => x.Status == InvoiceStatus.SUBMITTED),
                    Finalized = g.Count(x => x.Status == InvoiceStatus.FINALIZED),
                    Paid = g.Count(x => x.Status == InvoiceStatus.PAID)
                })
                .FirstOrDefaultAsync();

            return new AdminDashboardDTO
            {
                AdminTotalEmployees = users?.Total ?? 0,
                AdminTotalActiveEmployees = users?.Active ?? 0,
                AdminTotalCompanies = companies?.Total ?? 0,
                AdminTotalActiveCompanies = companies?.Active ?? 0,
                AdminTotalProjects = projects?.Total ?? 0,
                AdminTotalActiveProjects = projects?.Active ?? 0,
                AdminTotalBanks = banks?.Total ?? 0,
                AdminTotalActiveBanks = banks?.Active ?? 0,
                AdminTotalClients = clients?.Total ?? 0,
                AdminTotalActiveClients = clients?.Active ?? 0,
                AdminTotalInvoices = invoices?.Total ?? 0,
                AdminTotalGeneratedInvoices = invoices?.Generated ?? 0,
                AdminTotalFinallizedInvoices = invoices?.Finalized ?? 0,
                AdminTotalPaidInvoices = invoices?.Paid ?? 0,
            };
        }

        public async Task<AccountUserDashboardDTO> GetAccountUserDashboardAsync()
        {
            var companies = await _db.Companies.CountAsync();
            var clients = await _db.Clients.CountAsync();
            var projects = await _db.Projects.CountAsync();

            var invoices = await _db.Invoices
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Generated = g.Count(x => x.Status == InvoiceStatus.SUBMITTED),
                    Finalized = g.Count(x => x.Status == InvoiceStatus.FINALIZED),
                    Paid = g.Count(x => x.Status == InvoiceStatus.PAID)
                })
                .FirstOrDefaultAsync();

            return new AccountUserDashboardDTO
            {
                TotalCompanies = companies,
                TotalClients = clients,
                TotalProjects = projects,
                TotalGeneratedInvoices = invoices?.Generated ?? 0,
                TotalFinalizedInvoices = invoices?.Finalized ?? 0,
                TotalPaidInvoices = invoices?.Paid ?? 0,
            };
        }

        public async Task<ManagerDashboardDTO> GetManagerDashboardAsync()
        {
            var employees = await _db.Users.CountAsync();
            var projects = await _db.Projects.CountAsync();
            var clients = await _db.Clients.CountAsync();

            var timesheets = await _db.Timesheets
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Pending = g.Count(x => x.Status == TimeSheetStatus.SUBMITTED),
                    Approved = g.Count(x => x.Status == TimeSheetStatus.APPROVED),
                    Rejected = g.Count(x => x.Status == TimeSheetStatus.REJECTED),
                })
                .FirstOrDefaultAsync();

            return new ManagerDashboardDTO
            {
                TotalEmployees = employees,
                TotalProjects = projects,
                TotalClients = clients,
                TotalPendingTimesheets = timesheets?.Pending ?? 0,
                TotalApprovedTimesheets = timesheets?.Approved ?? 0,
                TotalRejectedTimesheets = timesheets?.Rejected ?? 0,
            };
        }

        public async Task<EmployeeDashboardDTO> GetEmployeeDashboardAsync(Guid empId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var timesheets = await _db.Timesheets
                .Where(x => x.UserId == empId)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Draft = g.Count(x => x.Status == TimeSheetStatus.DRAFT),
                    Submitted = g.Count(x => x.Status == TimeSheetStatus.SUBMITTED),
                    Approved = g.Count(x => x.Status == TimeSheetStatus.APPROVED),
                    Rejected = g.Count(x => x.Status == TimeSheetStatus.REJECTED),
                    ThisMonth = g.Count(x => x.WeekStartDate.Month == today.Month
                                          && x.WeekStartDate.Year == today.Year),
                })
                .FirstOrDefaultAsync();

            var allHours = await _db.TimeEntries
                .Where(x => x.Timesheet.UserId == empId && x.HoursWorked >= 0)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    TotalHours = (int)g.Sum(x => x.HoursWorked),
                    BillableHours = (int)g.Where(x => x.IsBillable).Sum(x => x.HoursWorked),
                })
                .FirstOrDefaultAsync();

            var thisMonthBillable = await _db.TimeEntries
                .Where(x => x.Timesheet.UserId == empId
                         && x.HoursWorked >= 0
                         && x.IsBillable
                         && x.Timesheet.WeekStartDate.Month == today.Month
                         && x.Timesheet.WeekStartDate.Year == today.Year)
                .SumAsync(x => (int?)x.HoursWorked) ?? 0;

            return new EmployeeDashboardDTO
            {
                TotalTimeSheets = timesheets?.Total ?? 0,
                TotalWorkedHours = allHours?.TotalHours ?? 0,
                TotalBillableHours = allHours?.BillableHours ?? 0,
                TotalDraftTimeSheets = timesheets?.Draft ?? 0,
                TotalSubmittedTimeSheets = timesheets?.Submitted ?? 0,
                TotalApprovedTimeSheets = timesheets?.Approved ?? 0,
                TotalRejectedTimeSheets = timesheets?.Rejected ?? 0,
                ThisMonthTotalTimesheets = timesheets?.ThisMonth ?? 0,
                ThisMonthBillableHours = thisMonthBillable,
            };
        }

    }
}
