using ITSMS.Domain.Entities;

namespace ITSMS.Application.IRepositories
{
    public interface ITaskActivityRepository
    {
        Task<TaskActivity> CreateTaskActivityAsync(TaskActivity taskActivity);
        Task<TaskActivity?> GetTaskActivityByIdAsync(Guid taskId);
        Task<TaskActivity?> GetUpdateTaskActivityAsync(TaskActivity taskActivity);
        Task<TaskActivity?> GetDeleteTaskActivityAsync(TaskActivity taskActivity);
    }
}

