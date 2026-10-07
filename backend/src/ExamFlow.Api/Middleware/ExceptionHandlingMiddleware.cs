using System.Text.Json;
using ExamFlow.Application.Common.Exceptions;

namespace ExamFlow.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            await WriteAsync(context, ex.StatusCode, ReasonFor(ex.StatusCode), ex.Message,
                ex is ValidationException { Errors.Count: > 0 } v ? v.Errors : null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gözlənilməz xəta baş verdi.");
            await WriteAsync(context, 500, "Internal Server Error",
                "Serverdə gözlənilməz xəta baş verdi.", null);
        }
    }

    private static string ReasonFor(int status) => status switch
    {
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        409 => "Conflict",
        _ => "Error"
    };

    private static async Task WriteAsync(HttpContext context, int status, string error, string message,
        IReadOnlyDictionary<string, string[]>? errors)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var payload = new
        {
            status,
            error,
            message,
            errors
        };

        var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        });

        await context.Response.WriteAsync(json);
    }
}
