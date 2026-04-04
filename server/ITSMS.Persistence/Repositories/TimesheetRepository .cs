using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;
using ITSMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ITSMS.Persistence.Repositories
{
    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly ITSMSDbContext _db;
        public TimesheetRepository(ITSMSDbContext db) => _db = db;



        public Task<TimeSheet?> CheckandGetTimeSheetByUserAndDateAsync(Guid userId, DateOnly date)
        {
            return _db.Timesheets.FirstOrDefaultAsync(x => x.UserId == userId && x.WeekStartDate == date);
        }

        public Task<List<TimeSheet>> GetTimeSheetByUserIdAsync(Guid userId)
     => _db.Timesheets
           .Where(x => x.UserId == userId
                    && (x.Status == TimeSheetStatus.SUBMITTED
                     || x.Status == TimeSheetStatus.REJECTED
                     || x.Status == TimeSheetStatus.DRAFT))
           .OrderByDescending(x => x.WeekStartDate)
           .ToListAsync();

        public Task<TimeSheet?> GetTimeSheetByIdAsync(Guid timesheetId)
            => _db.Timesheets.Include(x => x.TimeEntries).FirstOrDefaultAsync(x => x.TimesheetId == timesheetId);

        public Task AddTimeSheetAsync(TimeSheet timesheet) => _db.Timesheets.AddAsync(timesheet).AsTask();
        public Task SaveChangesAsync() => _db.SaveChangesAsync();


        public async Task<List<TimeSheet>> GetTimeSheetHistoryByEmployeeIdAsync(Guid employeeId)
        {
            return await _db.Timesheets
                .Where(x =>
                    x.UserId == employeeId &&
                    (x.Status == TimeSheetStatus.APPROVED || x.Status == TimeSheetStatus.REJECTED || x.Status == TimeSheetStatus.SUBMITTED))
                .OrderByDescending(x => x.WeekStartDate)
                .ToListAsync();
        }
    }


}
