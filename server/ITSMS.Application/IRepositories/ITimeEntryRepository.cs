using ITSMS.Domain.Entities;

namespace ITSMS.Application.IRepositories
{
    public interface ITimeEntryRepository
    {
        Task AddAsync(TimeEntry entry);
        Task<List<TimeEntry>> GetByTimesheetIdAsync(Guid timesheetId);
        Task<TimeEntry?> GetTimeEntryByTaskIdAsync(Guid taskId);
        Task<TimeEntry> UpdateTimeEntryAsync(TimeEntry timeEntry);
        Task<TimeEntry> DeleteTimeEntryAsync(TimeEntry timeEntry);
        Task SaveChangesAsync();
    }
}
