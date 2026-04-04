using ITSMS.Application.DTOs.Report;
using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Entities.Identity;
using ITSMS.Domain.Enum;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace ITSMS.Persistence.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly ITSMSDbContext _context;
        private readonly UserManager<Employee> _userManager;

        public ManagerRepository(ITSMSDbContext context, UserManager<Employee> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        public Task<List<TimeSheet>> GetTimeSheetByUserIdForManagerAsync(Guid userId)
          => _context.Timesheets
                .Where(x => x.UserId == userId && x.Status == TimeSheetStatus.SUBMITTED)
                .OrderByDescending(x => x.WeekStartDate)
                .ToListAsync();

        public async Task<TimeSheet> UpdateReviewSheetManager(TimeSheet sheet)
        {
            if (sheet == null) return null;
            _context.Timesheets.Update(sheet);
            await _context.SaveChangesAsync();
            return sheet;

        }


        public async Task<TimeSheet?> GetTimesheetForApprovalAsync(Guid timesheetId, Guid employeeId)
        {
            return await _context.Timesheets
                .FirstOrDefaultAsync(t =>
                    t.TimesheetId == timesheetId &&
                    t.UserId == employeeId
                );
        }

        public async Task<ApprovalHistory> AddApprovalHistoryAsync(ApprovalHistory history)
        {
            await _context.ApprovalHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }

        public async Task<int> GetEmployeeCountForManager()
        {
            var employees = await _userManager.GetUsersInRoleAsync("Employee");
            return employees.Count;
        }

        public async Task<IReadOnlyList<Employee>> GetAllEmployeeForManager(string? search = null)
        {
            var employees = await _userManager.GetUsersInRoleAsync("Employee");

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = LikeEscaper.Escape(search.Trim());

                employees = employees
                    .Where(e =>
                        (!string.IsNullOrEmpty(e.FullName) && e.FullName.ToLower().Contains(term)) ||   
                        (!string.IsNullOrEmpty(e.UserName) && e.UserName.ToLower().Contains(term)) ||
                        (!string.IsNullOrEmpty(e.Email) && e.Email.ToLower().Contains(term))
                    )
                    .ToList();
            }

            return employees.ToList();
        }


        public async Task<EmployeeMonthlyReportDTO?> GetEmployeeMonthlyReportAsync(Guid employeeId, int month, int year)
        {
            if (month < 1 || month > 12)
                throw new ArgumentException("Month must be between 1 and 12.");

            var monthStart = new DateOnly(year, month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var rows = await (
                from te in _context.TimeEntries.AsNoTracking()
                join ts in _context.Timesheets.AsNoTracking()
                    on te.TimesheetId equals ts.TimesheetId
                join u in _context.Users.AsNoTracking()
                    on ts.UserId equals u.Id
                join c in _context.Clients.AsNoTracking()
                    on te.ClientId equals c.ClientId into cjoin
                from c in cjoin.DefaultIfEmpty()
                join p in _context.Projects.AsNoTracking()
                    on te.ProjectId equals p.ProjectId into pjoin
                from p in pjoin.DefaultIfEmpty()
                where ts.UserId == employeeId
                && ts.Status == TimeSheetStatus.APPROVED
                      && te.WorkDate >= monthStart
                      && te.WorkDate <= monthEnd
                select new
                {
                    te.WorkDate,
                    te.HoursWorked,
                    te.IsBillable,
                    EmployeeName = (u.FullName ?? u.UserName ?? ""),

                    ClientId = te.ClientId,
                    ClientName = c != null ? (c.ClientName ?? "") : "",

                    ProjectId = te.ProjectId,
                    ProjectName = p != null ? (p.ProjectName ?? "") : ""
                }
            ).ToListAsync();

            if (rows.Count == 0)
            {
                var empName = await _context.Users.AsNoTracking()
                    .Where(x => x.Id == employeeId)
                    .Select(x => x.FullName ?? x.UserName ?? "")
                    .FirstOrDefaultAsync();

                if (string.IsNullOrWhiteSpace(empName))
                    return null;

                return new EmployeeMonthlyReportDTO
                {
                    EmployeeId = employeeId,
                    EmployeeName = empName,
                    Month = month,
                    Year = year,
                    StartDate = monthStart,
                    EndDate = monthEnd,
                    TotalBillableHours = 0,
                    Items = new List<ClientProjectHourDTO>()
                };
            }

            var actualStart = rows.Min(x => x.WorkDate);
            var actualEnd = rows.Max(x => x.WorkDate);

            var items = rows
                .Where(x => x.IsBillable)
                .GroupBy(x => new { x.ClientId, x.ClientName, x.ProjectId, x.ProjectName })
                .Select(g => new ClientProjectHourDTO
                {
                    ClientId = g.Key.ClientId.ToString(),
                    ClientName = g.Key.ClientName ?? "",
                    ProjectId = g.Key.ProjectId.ToString(),
                    ProjectName = g.Key.ProjectName ?? "",
                    BillableHours = g.Sum(x => x.HoursWorked)
                })
                .OrderBy(x => x.ClientName)
                .ThenBy(x => x.ProjectName)
                .ToList();

            var totalBillable = items.Sum(i => i.BillableHours);

            return new EmployeeMonthlyReportDTO
            {
                EmployeeId = employeeId,
                EmployeeName = rows.First().EmployeeName,
                Month = month,
                Year = year,

                StartDate = monthStart,
                EndDate = monthEnd,

                ActualStartDate = actualStart,
                ActualEndDate = actualEnd,

                TotalBillableHours = totalBillable,
                Items = items
            };
        }


    }
}
