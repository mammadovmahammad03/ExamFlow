using ExamFlow.Application.DTOs.Reports;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Services;

public class DashboardService : IDashboardService
{
    private const int PassThreshold = 3;
    private readonly IUnitOfWork _uow;

    public DashboardService(IUnitOfWork uow) => _uow = uow;

    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken ct = default)
    {
        var subjectCount = await _uow.Subjects.CountAsync(ct);
        var studentCount = await _uow.Students.CountAsync(ct);
        var examCount = await _uow.Exams.CountAsync(ct);

        double averageGrade = 0;
        double passRate = 0;
        if (examCount > 0)
        {
            averageGrade = Math.Round(await _uow.Exams.Query().AverageAsync(e => (double)e.Grade, ct), 2);
            var passed = await _uow.Exams.Query().CountAsync(e => e.Grade >= PassThreshold, ct);
            passRate = Math.Round((double)passed / examCount, 2);
        }

        var subjectAverages = (await _uow.Exams.Query()
                .GroupBy(e => new { e.SubjectCode, Name = e.Subject!.Name })
                .Select(g => new { g.Key.SubjectCode, g.Key.Name, Avg = g.Average(x => (double)x.Grade), Count = g.Count() })
                .ToListAsync(ct))
            .Select(x => new SubjectAverageDto
            {
                SubjectCode = x.SubjectCode,
                SubjectName = x.Name,
                AverageGrade = Math.Round(x.Avg, 2),
                ExamCount = x.Count
            })
            .OrderByDescending(x => x.AverageGrade)
            .ToList();

        var distribution = (await _uow.Exams.Query()
                .GroupBy(e => e.Grade)
                .Select(g => new { Grade = g.Key, Count = g.Count() })
                .ToListAsync(ct))
            .Select(x => new GradeDistributionDto { Grade = x.Grade, Count = x.Count })
            .OrderBy(x => x.Grade)
            .ToList();

        var classPerformance = (await _uow.Exams.Query()
                .GroupBy(e => e.Student!.Grade)
                .Select(g => new { Grade = g.Key, Avg = g.Average(x => (double)x.Grade), Count = g.Count() })
                .ToListAsync(ct))
            .Select(x => new ClassPerformanceDto
            {
                Grade = x.Grade,
                AverageGrade = Math.Round(x.Avg, 2),
                ExamCount = x.Count
            })
            .OrderBy(x => x.Grade)
            .ToList();

        return new DashboardSummaryDto
        {
            Subjects = subjectCount,
            Students = studentCount,
            Exams = examCount,
            AverageGrade = averageGrade,
            PassRate = passRate,
            SubjectAverages = subjectAverages,
            GradeDistribution = distribution,
            ClassPerformance = classPerformance
        };
    }
}
