using System.Linq.Expressions;
using ExamFlow.Application.Common.Exceptions;
using ExamFlow.Application.Common.Extensions;
using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Students;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Services;
using ExamFlow.Application.Mapping;
using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Services;

public class StudentService : IStudentService
{
    private readonly IUnitOfWork _uow;

    private static readonly IReadOnlyDictionary<string, Expression<Func<Student, object>>> SortMap =
        new Dictionary<string, Expression<Func<Student, object>>>
        {
            ["number"] = s => s.Number,
            ["firstname"] = s => s.FirstName,
            ["lastname"] = s => s.LastName,
            ["grade"] = s => s.Grade
        };

    public StudentService(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<StudentDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default)
    {
        var q = _uow.Students.Query();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            q = q.Where(s => s.FirstName.Contains(term)
                || s.LastName.Contains(term)
                || s.Number.ToString().Contains(term));
        }

        return await q
            .OrderByDynamic(query.SortBy, query.Descending, SortMap, s => s.Number)
            .Select(Projections.Student)
            .ToPagedResultAsync(query.Page, query.PageSize, ct);
    }

    public async Task<StudentDto> GetByNumberAsync(int number, CancellationToken ct = default)
    {
        var dto = await _uow.Students.Query()
            .Where(s => s.Number == number)
            .Select(Projections.Student)
            .FirstOrDefaultAsync(ct);

        return dto ?? throw NotFoundException.For("Şagird", number);
    }

    public async Task<StudentDto> CreateAsync(CreateStudentRequest request, CancellationToken ct = default)
    {
        if (await _uow.Students.AnyAsync(s => s.Number == request.Number, ct))
            throw new ConflictException($"'{request.Number}' nömrəli şagird artıq mövcuddur.");

        var entity = new Student
        {
            Number = request.Number,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Grade = request.Grade
        };

        await _uow.Students.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        return await GetByNumberAsync(entity.Number, ct);
    }

    public async Task<StudentDto> UpdateAsync(int number, UpdateStudentRequest request, CancellationToken ct = default)
    {
        var entity = await _uow.Students.GetByNumberAsync(number, ct)
            ?? throw NotFoundException.For("Şagird", number);

        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.Grade = request.Grade;

        _uow.Students.Update(entity);
        await _uow.SaveChangesAsync(ct);

        return await GetByNumberAsync(entity.Number, ct);
    }

    public async Task DeleteAsync(int number, CancellationToken ct = default)
    {
        var entity = await _uow.Students.GetByNumberAsync(number, ct)
            ?? throw NotFoundException.For("Şagird", number);

        if (await _uow.Exams.AnyAsync(e => e.StudentNo == number, ct))
            throw new ConflictException($"'{number}' nömrəli şagirdə aid imtahan nəticələri olduğu üçün silinə bilməz.");

        _uow.Students.Remove(entity);
        await _uow.SaveChangesAsync(ct);
    }
}
