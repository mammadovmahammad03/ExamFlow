using System.Linq.Expressions;
using ExamFlow.Application.Common.Exceptions;
using ExamFlow.Application.Common.Extensions;
using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Exams;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Services;
using ExamFlow.Application.Mapping;
using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Services;

public class ExamService : IExamService
{
    private readonly IUnitOfWork _uow;

    private static readonly IReadOnlyDictionary<string, Expression<Func<Exam, object>>> SortMap =
        new Dictionary<string, Expression<Func<Exam, object>>>
        {
            ["date"] = e => e.ExamDate,
            ["grade"] = e => e.Grade,
            ["subject"] = e => e.SubjectCode,
            ["student"] = e => e.StudentNo
        };

    public ExamService(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<ExamDto>> GetPagedAsync(ExamFilter filter, CancellationToken ct = default)
    {
        var q = _uow.Exams.Query();

        if (!string.IsNullOrWhiteSpace(filter.SubjectCode))
        {
            var sc = filter.SubjectCode.ToUpperInvariant();
            q = q.Where(e => e.SubjectCode == sc);
        }

        if (filter.StudentNo is { } no)
            q = q.Where(e => e.StudentNo == no);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var term = filter.Search.Trim();
            q = q.Where(e => e.Subject!.Name.Contains(term)
                || e.Student!.FirstName.Contains(term)
                || e.Student!.LastName.Contains(term));
        }

        var descending = filter.SortBy is null ? true : filter.Descending;

        return await q
            .OrderByDynamic(filter.SortBy ?? "date", descending, SortMap, e => e.ExamDate)
            .Select(Projections.Exam)
            .ToPagedResultAsync(filter.Page, filter.PageSize, ct);
    }

    public async Task<ExamDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var dto = await _uow.Exams.Query()
            .Where(e => e.Id == id)
            .Select(Projections.Exam)
            .FirstOrDefaultAsync(ct);

        return dto ?? throw NotFoundException.For("İmtahan", id);
    }

    public async Task<ExamDto> CreateAsync(CreateExamRequest request, CancellationToken ct = default)
    {
        var subjectCode = request.SubjectCode.ToUpperInvariant();

        if (!await _uow.Subjects.AnyAsync(s => s.Code == subjectCode, ct))
            throw new NotFoundException($"'{subjectCode}' kodlu fənn mövcud deyil.");

        if (!await _uow.Students.AnyAsync(s => s.Number == request.StudentNo, ct))
            throw new NotFoundException($"'{request.StudentNo}' nömrəli şagird mövcud deyil.");

        if (await _uow.Exams.AnyAsync(e =>
                e.SubjectCode == subjectCode &&
                e.StudentNo == request.StudentNo &&
                e.ExamDate == request.ExamDate, ct))
            throw new ConflictException("Bu şagird üçün həmin fənn və tarixdə artıq imtahan qeydi var.");

        var entity = new Exam
        {
            SubjectCode = subjectCode,
            StudentNo = request.StudentNo,
            ExamDate = request.ExamDate,
            Grade = request.Grade
        };

        await _uow.Exams.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        return await GetByIdAsync(entity.Id, ct);
    }

    public async Task<ExamDto> UpdateAsync(int id, UpdateExamRequest request, CancellationToken ct = default)
    {
        var entity = await _uow.Exams.GetByIdAsync(id, ct)
            ?? throw NotFoundException.For("İmtahan", id);

        if (await _uow.Exams.AnyAsync(e =>
                e.Id != id &&
                e.SubjectCode == entity.SubjectCode &&
                e.StudentNo == entity.StudentNo &&
                e.ExamDate == request.ExamDate, ct))
            throw new ConflictException("Bu şagird üçün həmin fənn və tarixdə artıq imtahan qeydi var.");

        entity.ExamDate = request.ExamDate;
        entity.Grade = request.Grade;

        _uow.Exams.Update(entity);
        await _uow.SaveChangesAsync(ct);

        return await GetByIdAsync(entity.Id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var entity = await _uow.Exams.GetByIdAsync(id, ct)
            ?? throw NotFoundException.For("İmtahan", id);

        _uow.Exams.Remove(entity);
        await _uow.SaveChangesAsync(ct);
    }
}
