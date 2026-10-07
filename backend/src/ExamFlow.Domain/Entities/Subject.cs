namespace ExamFlow.Domain.Entities;

public class Subject
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public byte Grade { get; set; }
    public string TeacherFirstName { get; set; } = string.Empty;
    public string TeacherLastName { get; set; } = string.Empty;

    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}
