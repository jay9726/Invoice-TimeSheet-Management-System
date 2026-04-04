
using ITSMS.Authentication.JWT.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace ITSMS.Authentication.JWT.Services
{
    public static class JwtServiceExtension
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtModel = JWTConfiguration.GetJWTConfiguration(configuration);


            if (string.IsNullOrWhiteSpace(jwtModel.Key))
                throw new InvalidOperationException(
                    "JwtSettings:Key is not configured. " +
                    "Set it via dotnet user-secrets or an environment variable.");

            var keyBytes = Encoding.UTF8.GetBytes(jwtModel.Key);

            if (keyBytes.Length < 32)
                throw new InvalidOperationException(
                    $"JwtSettings:Key is only {keyBytes.Length} bytes. " +
                    "A minimum of 32 bytes (256 bits) is required. " +
                    "Generate a safe key with: " +
                    "Convert.ToBase64String(RandomNumberGenerator.GetBytes(64))");



            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtModel.Issuer,
                    ValidAudience = jwtModel.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

                    ClockSkew = TimeSpan.Zero,
                };

                options.Events = new JwtBearerEvents
                {
                    OnChallenge = async context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsJsonAsync(new
                        {
                            error = "Unauthorized",
                            message = "A valid JWT bearer token is required."
                        });
                    },
                    OnForbidden = async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsJsonAsync(new
                        {
                            error = "Forbidden",
                            message = "You do not have permission to access this resource."
                        });
                    },
                };
            });

            return services;
        }
    }
}
