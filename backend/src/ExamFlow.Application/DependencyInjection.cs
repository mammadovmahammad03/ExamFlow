using ExamFlow.Application.Interfaces.Services;
using ExamFlow.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ExamFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ISubjectService, SubjectService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IExamService, ExamService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();
        return services;
    }
}
