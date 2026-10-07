using ExamFlow.Application.Common.Exceptions;
using ExamFlow.Application.DTOs.Reports;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Services;

public class ReportService : IReportService
{
    private const int PassThreshold = 3;
    private readonly IUnitOfWork _uow;

    public ReportService(IUnitOfWork uow) => _uow = uow;

    public async Task<StudentReportDto> GetStudentReportAsync(int studentNumber, CancellationToken ct = default)
    {
        var student = await _uow.Students.Query()
            .Where(s => s.Number == studentNumber)
            .Select(s => new { s.Number, s.FirstName, s.LastName, s.Grade })
            .FirstOrDefaultAsync(ct)
            ?? throw NotFoundException.For("Şagird", studentNumber);

        var rows = await _uow.Exams.Query()
            .Where(e => e.StudentNo == studentNumber)
            .OrderBy(e => e.ExamDate)
            .Select(e => new StudentReportRowDto
            {
                SubjectCode = e.SubjectCode,
                SubjectName = e.Subject!.Name,
                ExamDate = e.ExamDate,
                Grade = e.Grade
            })
            .ToListAsync(ct);

        var average = rows.Count == 0 ? 0 : Math.Round(rows.Average(r => (double)r.Grade), 2);

        return new StudentReportDto
        {
            Number = student.Number,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade,
            AverageGrade = average,
            Results = rows
        };
    }

    public async Task<SubjectStatsDto> GetSubjectStatsAsync(string subjectCode, CancellationToken ct = default)
    {
        var code = subjectCode.ToUpperInvariant();
        var subject = await _uow.Subjects.Query()
            .Where(s => s.Code == code)
            .Select(s => new { s.Code, s.Name })
            .FirstOrDefaultAsync(ct)
            ?? throw NotFoundException.For("Fənn", subjectCode);

        var grades = await _uow.Exams.Query()
            .Where(e => e.SubjectCode == code)
            .Select(e => (int)e.Grade)
            .ToListAsync(ct);

        if (grades.Count == 0)
        {
            return new SubjectStatsDto
            {
                SubjectCode = subject.Code,
                SubjectName = subject.Name,
                ExamCount = 0,
                AverageGrade = 0,
                PassRate = 0,
                HighestGrade = 0,
                LowestGrade = 0
            };
        }

        return new SubjectStatsDto
        {
            SubjectCode = subject.Code,
            SubjectName = subject.Name,
            ExamCount = grades.Count,
            AverageGrade = Math.Round(grades.Average(), 2),
            PassRate = Math.Round((double)grades.Count(g => g >= PassThreshold) / grades.Count, 2),
            HighestGrade = (byte)grades.Max(),
            LowestGrade = (byte)grades.Min()
        };
    }
}
