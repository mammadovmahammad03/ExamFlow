using System.Linq.Expressions;
using ExamFlow.Application.DTOs.Auth;
using ExamFlow.Application.DTOs.Exams;
using ExamFlow.Application.DTOs.Students;
using ExamFlow.Application.DTOs.Subjects;
using ExamFlow.Domain.Entities;

namespace ExamFlow.Application.Mapping;

public static class Projections
{
    public static readonly Expression<Func<Subject, SubjectDto>> Subject = s => new SubjectDto
    {
        Code = s.Code,
        Name = s.Name,
        Grade = s.Grade,
        TeacherFirstName = s.TeacherFirstName,
        TeacherLastName = s.TeacherLastName,
        ExamCount = s.Exams.Count
    };

    public static readonly Expression<Func<Student, StudentDto>> Student = s => new StudentDto
    {
        Number = s.Number,
        FirstName = s.FirstName,
        LastName = s.LastName,
        Grade = s.Grade,
        ExamCount = s.Exams.Count
    };

    public static readonly Expression<Func<Exam, ExamDto>> Exam = e => new ExamDto
    {
        Id = e.Id,
        SubjectCode = e.SubjectCode,
        SubjectName = e.Subject!.Name,
        StudentNo = e.StudentNo,
        StudentFullName = e.Student!.FirstName + " " + e.Student!.LastName,
        ExamDate = e.ExamDate,
        Grade = e.Grade
    };

    public static UserDto ToDto(this User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Role = user.Role
    };
}
