using ExamFlow.Application.DTOs.Reports;

namespace ExamFlow.Application.Interfaces.Services;

public interface IReportService
{
    Task<StudentReportDto> GetStudentReportAsync(int studentNumber, CancellationToken ct = default);
    Task<SubjectStatsDto> GetSubjectStatsAsync(string subjectCode, CancellationToken ct = default);
}
