using System.Linq.Expressions;
using ExamFlow.Application.Common.Exceptions;
using ExamFlow.Application.Common.Extensions;
using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Subjects;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Services;
using ExamFlow.Application.Mapping;
using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Services;

public class SubjectService : ISubjectService
{
    private readonly IUnitOfWork _uow;

    private static readonly IReadOnlyDictionary<string, Expression<Func<Subject, object>>> SortMap =
        new Dictionary<string, Expression<Func<Subject, object>>>
        {
            ["code"] = s => s.Code,
            ["name"] = s => s.Name,
            ["grade"] = s => s.Grade
        };

    public SubjectService(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<SubjectDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default)
    {
        var q = _uow.Subjects.Query();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            q = q.Where(s => s.Code.Contains(term)
                || s.Name.Contains(term)
                || s.TeacherFirstName.Contains(term)
                || s.TeacherLastName.Contains(term));
        }

        return await q
            .OrderByDynamic(query.SortBy, query.Descending, SortMap, s => s.Code)
            .Select(Projections.Subject)
            .ToPagedResultAsync(query.Page, query.PageSize, ct);
    }

    public async Task<SubjectDto> GetByCodeAsync(string code, CancellationToken ct = default)
    {
        var dto = await _uow.Subjects.Query()
            .Where(s => s.Code == code)
            .Select(Projections.Subject)
            .FirstOrDefaultAsync(ct);

        return dto ?? throw NotFoundException.For("Fənn", code);
    }

    public async Task<SubjectDto> CreateAsync(CreateSubjectRequest request, CancellationToken ct = default)
    {
        var code = request.Code.ToUpperInvariant();
        if (await _uow.Subjects.AnyAsync(s => s.Code == code, ct))
            throw new ConflictException($"'{code}' kodlu fənn artıq mövcuddur.");

        var entity = new Subject
        {
            Code = code,
            Name = request.Name,
            Grade = request.Grade,
            TeacherFirstName = request.TeacherFirstName,
            TeacherLastName = request.TeacherLastName
        };

        await _uow.Subjects.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        return await GetByCodeAsync(entity.Code, ct);
    }

    public async Task<SubjectDto> UpdateAsync(string code, UpdateSubjectRequest request, CancellationToken ct = default)
    {
        var entity = await _uow.Subjects.GetByCodeAsync(code, ct)
            ?? throw NotFoundException.For("Fənn", code);

        entity.Name = request.Name;
        entity.Grade = request.Grade;
        entity.TeacherFirstName = request.TeacherFirstName;
        entity.TeacherLastName = request.TeacherLastName;

        _uow.Subjects.Update(entity);
        await _uow.SaveChangesAsync(ct);

        return await GetByCodeAsync(entity.Code, ct);
    }

    public async Task DeleteAsync(string code, CancellationToken ct = default)
    {
        var entity = await _uow.Subjects.GetByCodeAsync(code, ct)
            ?? throw NotFoundException.For("Fənn", code);

        if (await _uow.Exams.AnyAsync(e => e.SubjectCode == code, ct))
            throw new ConflictException($"'{code}' fənninə aid imtahan nəticələri olduğu üçün silinə bilməz.");

        _uow.Subjects.Remove(entity);
        await _uow.SaveChangesAsync(ct);
    }
}
