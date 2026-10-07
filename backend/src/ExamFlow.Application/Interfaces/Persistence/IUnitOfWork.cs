namespace ExamFlow.Application.Interfaces.Persistence;

public interface IUnitOfWork
{
    ISubjectRepository Subjects { get; }
    IStudentRepository Students { get; }
    IExamRepository Exams { get; }
    IUserRepository Users { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
