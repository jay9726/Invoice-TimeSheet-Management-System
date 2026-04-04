using CleanArchitecture.WebAPI.Extensions;
using ITSMS.API.Entensions;
using ITSMS.API.Extensions;
using ITSMS.API.Filters;
using ITSMS.Authentication.JWT.Services;
using ITSMS.Domain.Entities.Identity;
using ITSMS.Persistence.Context;
using ITSMS.Persistence.Extension;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);


builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables(); 

var jwtKey = builder.Configuration["Jwt:Key"];
var connectionString = builder.Configuration.GetConnectionString("ITSMSConnectionString");

if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException(
        "JWT Key is not configured. Set the 'Jwt__Key' environment variable.");

if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException(
        "Database connection string is not configured. Set the 'ITSMSConnectionString' environment variable.");





builder.Services.RegisterServices(builder.Configuration);
builder.Services.RegisterApplicationServices();
builder.Services.ConfigureCorsPolicy(builder.Configuration);

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
});


builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidateGuidFilter>();
});



builder.Services.AddIdentity<Employee, Role>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ITSMSDbContext>()
    .AddDefaultTokenProviders()
    .AddSignInManager<SignInManager<Employee>>();


builder.Services.AddJwtAuthentication(builder.Configuration);


if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}


builder.Services.AddControllers();


builder.Services.AddHealthChecks()
    .AddDbContextCheck<ITSMSDbContext>(
        name: "database",
        failureStatus: HealthStatus.Unhealthy,
        tags: ["ready", "db"]);



var app = builder.Build();

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,   
    ResponseWriter = HealthCheckExtension.WriteResponse
});


app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = HealthCheckExtension.WriteResponse
});



app.ApplyMigrations();

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Employee>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
    await DataSeeder.SeedDataAsync(userManager, roleManager);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();

}


app.UseCors();


app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        ctx.Context.Response.Headers["Access-Control-Allow-Headers"] = "*";
        ctx.Context.Response.Headers["Access-Control-Allow-Methods"] = "*";
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}


app.UseErrorHandler();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
