using ITSMS.Application.IRepositories;

namespace ITSMS.Application.ICommon
{
    public interface IUnitOfWork : IDisposable
    {
        IAdminRepository AdminRepository { get; } 
        IAuthRepository AuthRepository { get; } 
        IClientRepository ClientRepository { get; }
        ICompanyBankDetailRepository CompanyBankDetailRepository { get; }
        ICompanyRepository CompanyRepository { get; }
        IDashboardRepository DashboardRepository { get; }
        IEmployeeRepository EmployeeRepository { get; }
        IInvoiceRepository InvoiceRepository { get; }
        IManagerRepository ManagerRepository { get; }
        IProjectRepository ProjectRepository { get; }
        ITaskActivityRepository TaskActivityRepository { get; }
        ITimeEntryRepository TimeEntryRepository { get; }
        ITimesheetRepository TimesheetRepository { get; }
        Task Save();
    }
}
