namespace ExamFlow.Application.DTOs.Reports;

public record DashboardSummaryDto
{
    public int Subjects { get; init; }
    public int Students { get; init; }
    public int Exams { get; init; }
    public double AverageGrade { get; init; }
    public double PassRate { get; init; }
    public IReadOnlyList<SubjectAverageDto> SubjectAverages { get; init; } = Array.Empty<SubjectAverageDto>();
    public IReadOnlyList<GradeDistributionDto> GradeDistribution { get; init; } = Array.Empty<GradeDistributionDto>();
    public IReadOnlyList<ClassPerformanceDto> ClassPerformance { get; init; } = Array.Empty<ClassPerformanceDto>();
}

public record SubjectAverageDto
{
    public string SubjectCode { get; init; } = string.Empty;
    public string SubjectName { get; init; } = string.Empty;
    public double AverageGrade { get; init; }
    public int ExamCount { get; init; }
}

public record GradeDistributionDto
{
    public byte Grade { get; init; }
    public int Count { get; init; }
}

public record ClassPerformanceDto
{
    public byte Grade { get; init; }
    public double AverageGrade { get; init; }
    public int ExamCount { get; init; }
}

public record StudentReportDto
{
    public int Number { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public byte Grade { get; init; }
    public double AverageGrade { get; init; }
    public IReadOnlyList<StudentReportRowDto> Results { get; init; } = Array.Empty<StudentReportRowDto>();
}

public record StudentReportRowDto
{
    public string SubjectCode { get; init; } = string.Empty;
    public string SubjectName { get; init; } = string.Empty;
    public DateOnly ExamDate { get; init; }
    public byte Grade { get; init; }
}

public record SubjectStatsDto
{
    public string SubjectCode { get; init; } = string.Empty;
    public string SubjectName { get; init; } = string.Empty;
    public int ExamCount { get; init; }
    public double AverageGrade { get; init; }
    public double PassRate { get; init; }
    public byte HighestGrade { get; init; }
    public byte LowestGrade { get; init; }
}
