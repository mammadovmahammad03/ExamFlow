namespace ExamFlow.Domain.Entities;

public class Exam
{
    public int Id { get; set; }
    public string SubjectCode { get; set; } = string.Empty;
    public int StudentNo { get; set; }
    public DateOnly ExamDate { get; set; }
    public byte Grade { get; set; }

    public Subject? Subject { get; set; }
    public Student? Student { get; set; }
}
