using System.Net;
using System.Text.Json;
using ITSMS.Application.ICommon.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace CleanArchitecture.WebAPI.Extensions;

public static class ErrorHandlerExtensions
{
    public static void UseErrorHandler(this IApplicationBuilder app)
    {
        var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();
        var logger = app.ApplicationServices
                        .GetRequiredService<ILoggerFactory>()
                        .CreateLogger("ErrorHandler");

        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature == null) return;

                var error = contextFeature.Error;

                context.Response.ContentType = "application/json";

                context.Response.StatusCode = error switch
                {
                    BadRequestException => (int)HttpStatusCode.BadRequest,
                    OperationCanceledException => (int)HttpStatusCode.ServiceUnavailable,
                    NotFoundException => (int)HttpStatusCode.NotFound,
                    _ => (int)HttpStatusCode.InternalServerError
                };

                if (context.Response.StatusCode >= 500)
                    logger.LogError(error,
                        "Unhandled exception. TraceId: {TraceId}",
                        context.TraceIdentifier);
                else
                    logger.LogWarning(error,
                        "Handled exception ({StatusCode}). TraceId: {TraceId}",
                        context.Response.StatusCode, context.TraceIdentifier);

                var clientMessage = context.Response.StatusCode >= 500
                    ? env.IsDevelopment()
                        ? error.GetBaseException().Message   
                        : "An unexpected error occurred. Please try again later."  
                    : error.GetBaseException().Message;      

                var errorResponse = new
                {
                    statusCode = context.Response.StatusCode,
                    message = clientMessage,
                    traceId = context.TraceIdentifier,
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
            });
        });
    }
}