using ITSMS.Application.ICommon;
using ITSMS.Application.IRepositories;
using ITSMS.Domain.Entities.Identity;
using ITSMS.Persistence.Context;
using Microsoft.AspNetCore.Identity;

namespace ITSMS.Persistence.Common
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ITSMSDbContext _context;
        private readonly UserManager<Employee> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<Employee> _signInManager;


        private readonly Lazy<IAdminRepository> _adminRepository;
        private readonly Lazy<IAuthRepository> _authRepository;
        private readonly Lazy<IClientRepository> _clientRepository;
        private readonly Lazy<ICompanyBankDetailRepository> _companyBankDetailRepository;
        private readonly Lazy<ICompanyRepository> _companyRepository;
        private readonly Lazy<IDashboardRepository> _dashboardRepository;
        private readonly Lazy<IEmployeeRepository> _employeeRepository;
        private readonly Lazy<IInvoiceRepository> _invoiceRepository;
        private readonly Lazy<IManagerRepository> _managerRepository;
        private readonly Lazy<IProjectRepository> _projectRepository;
        private readonly Lazy<ITaskActivityRepository> _taskActivityRepository;
        private readonly Lazy<ITimeEntryRepository> _timeEntryRepository;
        private readonly Lazy<ITimesheetRepository> _timesheetRepository;


        public UnitOfWork(
            ITSMSDbContext context,
            UserManager<Employee> userManager,
            RoleManager<Role> roleManager,
            SignInManager<Employee> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;



            _adminRepository = new Lazy<IAdminRepository>(() =>
                new Repositories.AdminRepository(_context));

            _authRepository = new Lazy<IAuthRepository>(() =>
                new Repositories.AuthRepository(_roleManager, _signInManager, _userManager));

            _clientRepository = new Lazy<IClientRepository>(() =>
                new Repositories.ClientsRepository(_context));

            _companyBankDetailRepository = new Lazy<ICompanyBankDetailRepository>(() =>
                new Repositories.CompanyBankDetailRepository(_context));

            _companyRepository = new Lazy<ICompanyRepository>(() =>
                new Repositories.CompanyRepository(_context));

            _dashboardRepository = new Lazy<IDashboardRepository>(() =>
                new Repositories.DashboardRepository(_context));

            _employeeRepository = new Lazy<IEmployeeRepository>(() =>
                new Repositories.EmployeeRepository(_context, _userManager));

            _invoiceRepository = new Lazy<IInvoiceRepository>(() =>
                new Repositories.InvoiceRepository(_context));

            _managerRepository = new Lazy<IManagerRepository>(() =>
                new Repositories.ManagerRepository(_context, _userManager));

            _projectRepository = new Lazy<IProjectRepository>(() =>
                new Repositories.ProjectRepository(_context));

            _taskActivityRepository = new Lazy<ITaskActivityRepository>(() =>
                new Repositories.TaskActivityRepository(_context));

            _timeEntryRepository = new Lazy<ITimeEntryRepository>(() =>
                new Repositories.TimeEntryRepository(_context));

            _timesheetRepository = new Lazy<ITimesheetRepository>(() =>
                new Repositories.TimesheetRepository(_context));
        }



        public IAdminRepository AdminRepository => _adminRepository.Value;
        public IAuthRepository AuthRepository => _authRepository.Value;
        public IClientRepository ClientRepository => _clientRepository.Value;
        public ICompanyBankDetailRepository CompanyBankDetailRepository => _companyBankDetailRepository.Value;
        public ICompanyRepository CompanyRepository => _companyRepository.Value;
        public IDashboardRepository DashboardRepository => _dashboardRepository.Value;
        public IEmployeeRepository EmployeeRepository => _employeeRepository.Value;
        public IInvoiceRepository InvoiceRepository => _invoiceRepository.Value;
        public IManagerRepository ManagerRepository => _managerRepository.Value;
        public IProjectRepository ProjectRepository => _projectRepository.Value;
        public ITaskActivityRepository TaskActivityRepository => _taskActivityRepository.Value;
        public ITimeEntryRepository TimeEntryRepository => _timeEntryRepository.Value;
        public ITimesheetRepository TimesheetRepository => _timesheetRepository.Value;



        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }


        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
