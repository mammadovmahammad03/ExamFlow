using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Security;
using ExamFlow.Infrastructure.Persistence;
using ExamFlow.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ExamFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ExamFlowDbContext>(options =>
            options.UseSqlServer(
                config.GetConnectionString("Default"),
                sql => sql.MigrationsAssembly(typeof(ExamFlowDbContext).Assembly.FullName)));

        services.Configure<JwtSettings>(config.GetSection(JwtSettings.SectionName));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<ITokenService, TokenService>();

        return services;
    }
}
