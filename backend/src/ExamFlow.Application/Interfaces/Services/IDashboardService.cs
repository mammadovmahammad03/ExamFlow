using ExamFlow.Application.DTOs.Reports;

namespace ExamFlow.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken ct = default);
}
