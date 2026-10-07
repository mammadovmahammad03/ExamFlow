using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Subjects;

namespace ExamFlow.Application.Interfaces.Services;

public interface ISubjectService
{
    Task<PagedResult<SubjectDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default);
    Task<SubjectDto> GetByCodeAsync(string code, CancellationToken ct = default);
    Task<SubjectDto> CreateAsync(CreateSubjectRequest request, CancellationToken ct = default);
    Task<SubjectDto> UpdateAsync(string code, UpdateSubjectRequest request, CancellationToken ct = default);
    Task DeleteAsync(string code, CancellationToken ct = default);
}
