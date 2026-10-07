using ExamFlow.Application.Interfaces.Security;
using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ExamFlowDbContext db, IPasswordHasher hasher, CancellationToken ct = default)
    {
        if (!await db.Users.AnyAsync(ct))
        {
            db.Users.AddRange(
                new User { Email = "admin@examflow.local", PasswordHash = hasher.Hash("Admin123!"), Role = UserRoles.Admin },
                new User { Email = "teacher@examflow.local", PasswordHash = hasher.Hash("Teacher123!"), Role = UserRoles.Teacher },
                new User { Email = "student@examflow.local", PasswordHash = hasher.Hash("Student123!"), Role = UserRoles.Student });
        }

        if (!await db.Subjects.AnyAsync(ct))
        {
            db.Subjects.AddRange(
                new Subject { Code = "MAT", Name = "Mathematics", Grade = 9, TeacherFirstName = "Aysel", TeacherLastName = "Mammadova" },
                new Subject { Code = "PHY", Name = "Physics", Grade = 9, TeacherFirstName = "Elnur", TeacherLastName = "Huseynov" },
                new Subject { Code = "CHE", Name = "Chemistry", Grade = 9, TeacherFirstName = "Nigar", TeacherLastName = "Aliyeva" },
                new Subject { Code = "BIO", Name = "Biology", Grade = 9, TeacherFirstName = "Rashad", TeacherLastName = "Guliyev" },
                new Subject { Code = "HIS", Name = "History", Grade = 10, TeacherFirstName = "Leyla", TeacherLastName = "Ismayilova" });
        }

        if (!await db.Students.AnyAsync(ct))
        {
            db.Students.AddRange(
                new Student { Number = 10001, FirstName = "Elvin", LastName = "Aliyev", Grade = 9 },
                new Student { Number = 10002, FirstName = "Nurlan", LastName = "Mammadov", Grade = 9 },
                new Student { Number = 10003, FirstName = "Aysu", LastName = "Hasanova", Grade = 9 },
                new Student { Number = 10004, FirstName = "Kamran", LastName = "Ibrahimov", Grade = 9 },
                new Student { Number = 10005, FirstName = "Leyla", LastName = "Quliyeva", Grade = 10 });
        }

        await db.SaveChangesAsync(ct);

        if (!await db.Exams.AnyAsync(ct))
        {
            db.Exams.AddRange(
                new Exam { SubjectCode = "MAT", StudentNo = 10001, ExamDate = new DateOnly(2026, 6, 10), Grade = 5 },
                new Exam { SubjectCode = "MAT", StudentNo = 10002, ExamDate = new DateOnly(2026, 6, 10), Grade = 4 },
                new Exam { SubjectCode = "MAT", StudentNo = 10003, ExamDate = new DateOnly(2026, 6, 10), Grade = 3 },
                new Exam { SubjectCode = "PHY", StudentNo = 10001, ExamDate = new DateOnly(2026, 6, 12), Grade = 4 },
                new Exam { SubjectCode = "PHY", StudentNo = 10003, ExamDate = new DateOnly(2026, 6, 12), Grade = 3 },
                new Exam { SubjectCode = "CHE", StudentNo = 10004, ExamDate = new DateOnly(2026, 6, 14), Grade = 5 },
                new Exam { SubjectCode = "BIO", StudentNo = 10002, ExamDate = new DateOnly(2026, 6, 15), Grade = 4 },
                new Exam { SubjectCode = "HIS", StudentNo = 10005, ExamDate = new DateOnly(2026, 6, 16), Grade = 4 });

            await db.SaveChangesAsync(ct);
        }
    }
}
