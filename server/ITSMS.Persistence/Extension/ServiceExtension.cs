using ITSMS.Application.ICommon;
using ITSMS.Application.IRepositories;
using ITSMS.Persistence.Common;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace ITSMS.Persistence.Extension
{
    public static class ServiceExtension
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ITSMSDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("ITSMSConnectionString")));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            

            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<IClientRepository, ClientsRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<ITaskActivityRepository, TaskActivityRepository>();
            services.AddScoped<ICompanyBankDetailRepository, CompanyBankDetailRepository>();
            services.AddScoped<ITimeEntryRepository, TimeEntryRepository>();
            services.AddScoped<ITimesheetRepository, TimesheetRepository>();
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IManagerRepository, ManagerRepository>();
            services.AddScoped<IInvoiceRepository, InvoiceRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();

        }
    }
}
