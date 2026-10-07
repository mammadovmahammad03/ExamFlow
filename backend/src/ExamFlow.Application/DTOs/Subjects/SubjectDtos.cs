using System.ComponentModel.DataAnnotations;

namespace ExamFlow.Application.DTOs.Subjects;

public record SubjectDto
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public byte Grade { get; init; }
    public string TeacherFirstName { get; init; } = string.Empty;
    public string TeacherLastName { get; init; } = string.Empty;
    public int ExamCount { get; init; }
}

public record CreateSubjectRequest
{
    [Required, RegularExpression("^[A-Za-z0-9]{3}$", ErrorMessage = "Kod düz 3 simvol olmalıdır.")]
    public string Code { get; init; } = string.Empty;

    [Required, MaxLength(30)]
    public string Name { get; init; } = string.Empty;

    [Range(1, 12)]
    public byte Grade { get; init; }

    [Required, MaxLength(20)]
    public string TeacherFirstName { get; init; } = string.Empty;

    [Required, MaxLength(20)]
    public string TeacherLastName { get; init; } = string.Empty;
}

public record UpdateSubjectRequest
{
    [Required, MaxLength(30)]
    public string Name { get; init; } = string.Empty;

    [Range(1, 12)]
    public byte Grade { get; init; }

    [Required, MaxLength(20)]
    public string TeacherFirstName { get; init; } = string.Empty;

    [Required, MaxLength(20)]
    public string TeacherLastName { get; init; } = string.Empty;
}
