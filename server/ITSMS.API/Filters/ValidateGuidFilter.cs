using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ITSMS.API.Filters
{
    public class ValidateGuidFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var (key, value) in context.ActionArguments)
            {
                if (value is string str &&
                    (key.EndsWith("Id", StringComparison.OrdinalIgnoreCase) ||
                     key.Equals("id", StringComparison.OrdinalIgnoreCase)))
                {
                    if (!Guid.TryParse(str, out _))
                    {
                        context.Result = new BadRequestObjectResult(new
                        {
                            error = "Invalid identifier format.",
                            field = key,
                            value = str,
                            message = $"'{key}' must be a valid GUID " + "(e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6)."
                        });
                        return;
                    }
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is FormatException ex &&
                ex.Message.Contains("Guid", StringComparison.OrdinalIgnoreCase))
            {
                context.Result = new BadRequestObjectResult(new
                {
                    error = "Invalid identifier format.",
                    message = "One or more identifiers were not valid GUIDs."
                });
                context.ExceptionHandled = true;
            }
        }
    }
}
