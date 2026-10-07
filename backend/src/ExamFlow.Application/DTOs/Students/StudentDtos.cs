using System.ComponentModel.DataAnnotations;

namespace ExamFlow.Application.DTOs.Students;

public record StudentDto
{
    public int Number { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public byte Grade { get; init; }
    public int ExamCount { get; init; }
}

public record CreateStudentRequest
{
    [Range(1, 99999, ErrorMessage = "Nömrə 1 ilə 99999 arasında olmalıdır.")]
    public int Number { get; init; }

    [Required, MaxLength(30)]
    public string FirstName { get; init; } = string.Empty;

    [Required, MaxLength(30)]
    public string LastName { get; init; } = string.Empty;

    [Range(1, 12)]
    public byte Grade { get; init; }
}

public record UpdateStudentRequest
{
    [Required, MaxLength(30)]
    public string FirstName { get; init; } = string.Empty;

    [Required, MaxLength(30)]
    public string LastName { get; init; } = string.Empty;

    [Range(1, 12)]
    public byte Grade { get; init; }
}
