using ITSMS.API.helper;
using ITSMS.Application.IServices;
using ITSMS.Application.Mappper;
using ITSMS.Application.Services;
using ITSMS.Authentication.JWT.EmailService;
using ITSMS.Authentication.JWT.Services;
using ITSMS.Authentication.JWT.Template;
using Microsoft.OpenApi.Models;

namespace ITSMS.API.Entensions
{
    public static partial class ServiceInitializer
    {
        public static IServiceCollection RegisterApplicationServices(this IServiceCollection services)
        {
            RegisterSwagger(services);

            RegisterAutomapper(services);

            RegisterCompanyService(services);

            RegisterCompanyBankDetailsService(services);

            RegisterClientService(services);

            RegisterProjectService(services);

            RegisterTimeEntryService(services);

            RegisterTimeSheetService(services);

            RegisterAuthService(services);

            RegisterEmployeeService(services);

            RegisterManagerService(services);

            RegisterEmailService(services);

            RegisterEmailTemplateService(services);

            RegisterInvoiceService(services);

            RegisterAdminService(services);

            RegisterDashboardService(services);

            RegisterUploadImageService(services);

            RegisterSubmitEmailTemplate(services);

            RegisterJwtTokenService(services);

            return services;
        }

        private static void RegisterSwagger(IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ITSMS API",
                    Version = "v1",
                    Description = "Invoice and Timesheet Management System API"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token below.\r\n\r\nExample: eyJhbGciOiJIUzI1NiIs..."
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id   = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
        }

        private static void RegisterAutomapper(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile).Assembly);
        }
        private static void RegisterJwtTokenService(IServiceCollection services)
        {
            services.AddSingleton<IJwtTokenService, JwtTokenService>();
        }
        private static void RegisterCompanyService(IServiceCollection services)
        {
            services.AddScoped<ICompanyService, CompanyService>();
        }
        private static void RegisterCompanyBankDetailsService(IServiceCollection services)
        {
            services.AddScoped<ICompanyBankDetailService, CompanyBankDetailService>();
        }
        private static void RegisterClientService(IServiceCollection services)
        {
            services.AddScoped<IClientsService, ClientsService>();
        }
        private static void RegisterProjectService(IServiceCollection services)
        {
            services.AddScoped<IProjectService, ProjectService>();
        }
        private static void RegisterTimeEntryService(IServiceCollection services)
        {
            services.AddScoped<ITimeEntryService, TimeEntryService>();
        }
        private static void RegisterTimeSheetService(IServiceCollection services)
        {
            services.AddScoped<ITimesheetService, TimesheetService>();
        }
        private static void RegisterAuthService(IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
        }
        private static void RegisterEmployeeService(IServiceCollection services)
        {
            services.AddScoped<IEmployeeService, EmployeeService>();
        }

        private static void RegisterManagerService(IServiceCollection services)
        {
            services.AddScoped<IManagerService, ManagerService>();
        }

        private static void RegisterEmailService(IServiceCollection services)
        {
            services.AddScoped<IEmailService, EmailService>();
        }
        private static void RegisterEmailTemplateService(IServiceCollection services)
        {
            services.AddScoped<IAuthEmailTemplateService, AuthEmailTemplateService>();
        }

        private static void RegisterInvoiceService(IServiceCollection services)
        {
            services.AddScoped<IInvoiceService, InvoiceService>();
        }

        private static void RegisterAdminService(IServiceCollection services)
        {
            services.AddScoped<IAdminService, AdminService>();
        }
        private static void RegisterDashboardService(IServiceCollection services)
        {
            services.AddScoped<IDashboardService, DashboardService>();
        }
        private static void RegisterUploadImageService(IServiceCollection services)
        {
            services.AddScoped<UploadImage>();
        }

        private static void RegisterSubmitEmailTemplate(IServiceCollection services)
        {
            services.AddScoped<IEmailTemplate, EmailTemplate>();
        }

    }
}
