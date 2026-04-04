using ITSMS.Persistence.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ITSMS.Persistence.Extension
{
    public static class MigrationExtension
    {
        public static IApplicationBuilder ApplyMigrations(this IApplicationBuilder application)
        {
            using var scope = application.ApplicationServices.CreateScope();

            var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ITSMSDbContext>>();


            if (!env.IsDevelopment())
            {
                logger.LogInformation(
                    "Skipping automatic migration in {Environment} environment. " +
                    "Run 'dotnet ef database update' as part of your deployment pipeline.",
                    env.EnvironmentName);

                return application;
            }

            try
            {
                logger.LogInformation("Applying database migrations (Development only)...");

                var dbContext = scope.ServiceProvider.GetRequiredService<ITSMSDbContext>();

                var pending = dbContext.Database.GetPendingMigrations().ToList();
                if (!pending.Any())
                {
                    logger.LogInformation("No pending migrations.");
                    return application;
                }

                logger.LogInformation("Applying {Count} pending migration(s): {Migrations}",
                    pending.Count,
                    string.Join(", ", pending));

                dbContext.Database.Migrate();

                logger.LogInformation("Migrations applied successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while applying migrations.");
                throw;
            }

            return application;
        }
    }
}