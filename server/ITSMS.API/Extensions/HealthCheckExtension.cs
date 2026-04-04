using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Text.Json;


namespace ITSMS.API.Extensions
{
    public static class HealthCheckExtension
    {
        public static Task WriteResponse(HttpContext context, HealthReport report)
        {
            context.Response.ContentType = "application/json";

            var response = new
            {
                status = report.Status.ToString(),
                duration = report.TotalDuration.TotalMilliseconds + "ms",
                checks = report.Entries.Select(e => new
                {
                    name = e.Key,
                    status = e.Value.Status.ToString(),
                    duration = e.Value.Duration.TotalMilliseconds + "ms",
                    error = context.RequestServices
                                    .GetRequiredService<IHostEnvironment>()
                                    .IsDevelopment()
                                  ? e.Value.Exception?.Message
                                  : null
                })
            };

            return context.Response.WriteAsync(
                JsonSerializer.Serialize(response, new JsonSerializerOptions
                {
                    WriteIndented = true
                }));
        }
    }
}