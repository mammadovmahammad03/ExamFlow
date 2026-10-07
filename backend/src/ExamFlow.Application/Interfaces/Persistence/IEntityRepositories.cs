using ExamFlow.Domain.Entities;

namespace ExamFlow.Application.Interfaces.Persistence;

public interface ISubjectRepository : IGenericRepository<Subject>
{
    Task<Subject?> GetByCodeAsync(string code, CancellationToken ct = default);
}

public interface IStudentRepository : IGenericRepository<Student>
{
    Task<Student?> GetByNumberAsync(int number, CancellationToken ct = default);
}

public interface IExamRepository : IGenericRepository<Exam>
{
    Task<Exam?> GetByIdAsync(int id, CancellationToken ct = default);
}

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
}
