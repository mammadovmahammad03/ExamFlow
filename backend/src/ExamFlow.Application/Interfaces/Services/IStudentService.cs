using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Students;

namespace ExamFlow.Application.Interfaces.Services;

public interface IStudentService
{
    Task<PagedResult<StudentDto>> GetPagedAsync(PaginationQuery query, CancellationToken ct = default);
    Task<StudentDto> GetByNumberAsync(int number, CancellationToken ct = default);
    Task<StudentDto> CreateAsync(CreateStudentRequest request, CancellationToken ct = default);
    Task<StudentDto> UpdateAsync(int number, UpdateStudentRequest request, CancellationToken ct = default);
    Task DeleteAsync(int number, CancellationToken ct = default);
}
