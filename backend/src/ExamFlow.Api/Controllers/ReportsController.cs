using ExamFlow.Application.DTOs.Reports;
using ExamFlow.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamFlow.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "Admin,Teacher")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _service;

    public ReportsController(IReportService service) => _service = service;

    [HttpGet("student/{number:int}")]
    public async Task<ActionResult<StudentReportDto>> StudentReport(int number, CancellationToken ct)
        => Ok(await _service.GetStudentReportAsync(number, ct));

    [HttpGet("subject/{code}")]
    public async Task<ActionResult<SubjectStatsDto>> SubjectStats(string code, CancellationToken ct)
        => Ok(await _service.GetSubjectStatsAsync(code, ct));
}
