using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Infrastructure.Persistence.Repositories;

public class SubjectRepository : GenericRepository<Subject>, ISubjectRepository
{
    public SubjectRepository(ExamFlowDbContext db) : base(db) { }

    public Task<Subject?> GetByCodeAsync(string code, CancellationToken ct = default)
        => Set.FirstOrDefaultAsync(s => s.Code == code, ct);
}

public class StudentRepository : GenericRepository<Student>, IStudentRepository
{
    public StudentRepository(ExamFlowDbContext db) : base(db) { }

    public Task<Student?> GetByNumberAsync(int number, CancellationToken ct = default)
        => Set.FirstOrDefaultAsync(s => s.Number == number, ct);
}

public class ExamRepository : GenericRepository<Exam>, IExamRepository
{
    public ExamRepository(ExamFlowDbContext db) : base(db) { }

    public Task<Exam?> GetByIdAsync(int id, CancellationToken ct = default)
        => Set.FirstOrDefaultAsync(e => e.Id == id, ct);
}

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ExamFlowDbContext db) : base(db) { }

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => Set.FirstOrDefaultAsync(u => u.Email == email, ct);

    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
        => Set.AnyAsync(u => u.Email == email, ct);
}
