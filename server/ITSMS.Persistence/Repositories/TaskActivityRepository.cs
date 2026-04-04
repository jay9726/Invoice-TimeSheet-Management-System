using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities;
using ITSMS.Persistence.Context;

namespace ITSMS.Persistence.Repositories
{
    public class TaskActivityRepository : ITaskActivityRepository
    {
        private readonly ITSMSDbContext _context;

        public TaskActivityRepository(ITSMSDbContext context) 
        {
            _context = context;
        }


        public async Task<TaskActivity> CreateTaskActivityAsync(TaskActivity taskActivity)
        {
             await _context.TaskActivities.AddAsync(taskActivity);
            //await _context.SaveChangesAsync();
            return taskActivity;
        }

        public async Task<TaskActivity?> GetTaskActivityByIdAsync(Guid taskId)
        {
            return await _context.TaskActivities.FindAsync(taskId);
        }
        public async Task<TaskActivity?> GetUpdateTaskActivityAsync(TaskActivity taskActivity)
        {
            _context.TaskActivities.Update(taskActivity);
            await _context.SaveChangesAsync();
            return taskActivity;
        }

        public async Task<TaskActivity?> GetDeleteTaskActivityAsync(TaskActivity taskActivity)
        {
            _context.TaskActivities.Remove(taskActivity);
            await _context.SaveChangesAsync();
            return taskActivity;
        }


    }
}
