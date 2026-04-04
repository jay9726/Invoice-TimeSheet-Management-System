namespace CleanArchitecture.WebAPI.Extensions;

public static class CorsPolicyExtensions
{
    public static void ConfigureCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration
           .GetValue<string>("Cors:AllowedOrigins");

        if (origins == null)
            throw new InvalidOperationException(
                "Cors:AllowedOrigins is not configured. " +
                "Add it to appsettings.json.");

        var allowedOrigins = origins.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                  .Select(o => o.Trim())
                                  .ToArray();
        services.AddCors(opt =>
        {
            opt.AddDefaultPolicy(builder => builder
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Content-Disposition"));
        });
    }
}