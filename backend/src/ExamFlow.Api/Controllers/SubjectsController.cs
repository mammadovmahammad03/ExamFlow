using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Subjects;
using ExamFlow.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamFlow.Api.Controllers;

[ApiController]
[Route("api/subjects")]
[Authorize]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _service;

    public SubjectsController(ISubjectService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<SubjectDto>>> GetAll([FromQuery] PaginationQuery query, CancellationToken ct)
        => Ok(await _service.GetPagedAsync(query, ct));

    [HttpGet("{code}")]
    public async Task<ActionResult<SubjectDto>> GetByCode(string code, CancellationToken ct)
        => Ok(await _service.GetByCodeAsync(code, ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubjectDto>> Create(CreateSubjectRequest request, CancellationToken ct)
    {
        var created = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetByCode), new { code = created.Code }, created);
    }

    [HttpPut("{code}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubjectDto>> Update(string code, UpdateSubjectRequest request, CancellationToken ct)
        => Ok(await _service.UpdateAsync(code, request, ct));

    [HttpDelete("{code}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string code, CancellationToken ct)
    {
        await _service.DeleteAsync(code, ct);
        return NoContent();
    }
}
