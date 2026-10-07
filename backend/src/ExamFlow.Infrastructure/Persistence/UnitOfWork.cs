using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Infrastructure.Persistence.Repositories;

namespace ExamFlow.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ExamFlowDbContext _db;

    public UnitOfWork(ExamFlowDbContext db)
    {
        _db = db;
        Subjects = new SubjectRepository(db);
        Students = new StudentRepository(db);
        Exams = new ExamRepository(db);
        Users = new UserRepository(db);
    }

    public ISubjectRepository Subjects { get; }
    public IStudentRepository Students { get; }
    public IExamRepository Exams { get; }
    public IUserRepository Users { get; }

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
