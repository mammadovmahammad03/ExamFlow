using System.ComponentModel.DataAnnotations;

namespace ExamFlow.Application.DTOs.Exams;

public record ExamDto
{
    public int Id { get; init; }
    public string SubjectCode { get; init; } = string.Empty;
    public string SubjectName { get; init; } = string.Empty;
    public int StudentNo { get; init; }
    public string StudentFullName { get; init; } = string.Empty;
    public DateOnly ExamDate { get; init; }
    public byte Grade { get; init; }
}

public record CreateExamRequest
{
    [Required, RegularExpression("^[A-Za-z0-9]{3}$")]
    public string SubjectCode { get; init; } = string.Empty;

    [Range(1, 99999)]
    public int StudentNo { get; init; }

    [Required]
    public DateOnly ExamDate { get; init; }

    [Range(2, 5, ErrorMessage = "Qiymət 2 ilə 5 arasında olmalıdır.")]
    public byte Grade { get; init; }
}

public record UpdateExamRequest
{
    [Required]
    public DateOnly ExamDate { get; init; }

    [Range(2, 5, ErrorMessage = "Qiymət 2 ilə 5 arasında olmalıdır.")]
    public byte Grade { get; init; }
}

public class ExamFilter : Common.Models.PaginationQuery
{
    public string? SubjectCode { get; set; }
    public int? StudentNo { get; set; }
}
