using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Infrastructure.Persistence;

public class ExamFlowDbContext : DbContext
{
    public ExamFlowDbContext(DbContextOptions<ExamFlowDbContext> options) : base(options) { }

    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ExamFlowDbContext).Assembly);
    }
}
