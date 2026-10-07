using ExamFlow.Application.Common.Models;
using ExamFlow.Application.DTOs.Students;
using ExamFlow.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamFlow.Api.Controllers;

[ApiController]
[Route("api/students")]
[Authorize(Roles = "Admin,Teacher")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _service;

    public StudentsController(IStudentService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<StudentDto>>> GetAll([FromQuery] PaginationQuery query, CancellationToken ct)
        => Ok(await _service.GetPagedAsync(query, ct));

    [HttpGet("{number:int}")]
    public async Task<ActionResult<StudentDto>> GetByNumber(int number, CancellationToken ct)
        => Ok(await _service.GetByNumberAsync(number, ct));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentDto>> Create(CreateStudentRequest request, CancellationToken ct)
    {
        var created = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetByNumber), new { number = created.Number }, created);
    }

    [HttpPut("{number:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StudentDto>> Update(int number, UpdateStudentRequest request, CancellationToken ct)
        => Ok(await _service.UpdateAsync(number, request, ct));

    [HttpDelete("{number:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int number, CancellationToken ct)
    {
        await _service.DeleteAsync(number, ct);
        return NoContent();
    }
}
