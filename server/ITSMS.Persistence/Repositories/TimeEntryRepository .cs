using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ITSMS.Persistence.Repositories
{
    public class TimeEntryRepository : ITimeEntryRepository
    {
        private readonly ITSMSDbContext _db;
        public TimeEntryRepository(ITSMSDbContext db) => _db = db;

        public Task AddAsync(TimeEntry entry) {
            _db.TimeEntries.AddAsync(entry).AsTask();
            return Task.CompletedTask;
        }

        public Task<List<TimeEntry>> GetByTimesheetIdAsync(Guid timesheetId)
            => _db.TimeEntries.Where(x => x.TimesheetId == timesheetId)
            .Include(x => x.Clients)
            .Include(x => x.Projects)
            .Include(x => x.TaskActivities)
                              .OrderByDescending(x => x.WorkDate)
                              .ToListAsync();

        public Task SaveChangesAsync() => _db.SaveChangesAsync();

        public async Task<TimeEntry?> GetTimeEntryByTaskIdAsync(Guid timeentryId)
        {
            return await _db.TimeEntries
                .Include(x => x.Clients)
                .Include(x => x.Projects)
                .Include(x => x.TaskActivities)
                .FirstOrDefaultAsync(x => x.TimeEntryId == timeentryId)                ;
        }


        public async Task<TimeEntry> UpdateTimeEntryAsync(TimeEntry timeEntry)
        {
            _db.TimeEntries.Update(timeEntry);
            await _db.SaveChangesAsync();
            return timeEntry;
        }


        public async Task<TimeEntry> DeleteTimeEntryAsync(TimeEntry timeEntry)
        {
            _db.TimeEntries.Remove(timeEntry);
            await _db.SaveChangesAsync();
            return timeEntry;
        }
    }
}
