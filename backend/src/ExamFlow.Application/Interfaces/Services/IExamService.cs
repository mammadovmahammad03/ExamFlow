using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Exams;

namespace ExamFlow.Application.Interfaces.Services;

public interface IExamService
{
    Task<PagedResult<ExamDto>> GetPagedAsync(ExamFilter filter, CancellationToken ct = default);
    Task<ExamDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ExamDto> CreateAsync(CreateExamRequest request, CancellationToken ct = default);
    Task<ExamDto> UpdateAsync(int id, UpdateExamRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
