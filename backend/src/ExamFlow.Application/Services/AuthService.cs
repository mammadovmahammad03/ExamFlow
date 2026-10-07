using ExamFlow.Application.Common.Exceptions;
using ExamFlow.Application.DTOs.Auth;
using ExamFlow.Application.Interfaces.Persistence;
using ExamFlow.Application.Interfaces.Security;
using ExamFlow.Application.Interfaces.Services;
using ExamFlow.Application.Mapping;
using ExamFlow.Domain.Entities;

namespace ExamFlow.Application.Services;

public class AuthService : IAuthService
{
    private const int RefreshTokenDays = 7;

    private readonly IUnitOfWork _uow;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(IUnitOfWork uow, IPasswordHasher passwordHasher, ITokenService tokenService)
    {
        _uow = uow;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<UserDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (!UserRoles.IsValid(request.Role))
            throw new ValidationException($"'{request.Role}' düzgün rol deyil. İcazə verilən: Admin, Teacher, Student.");

        if (await _uow.Users.EmailExistsAsync(email, ct))
            throw new ConflictException("Bu email artıq qeydiyyatdan keçib.");

        var user = new User
        {
            Email = email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _uow.Users.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        return user.ToDto();
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _uow.Users.GetByEmailAsync(email, ct);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Email və ya şifrə yanlışdır.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct = default)
    {
        var user = await _uow.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken, ct);

        if (user is null || user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedException("Refresh token etibarsız və ya vaxtı bitib.");

        return await IssueTokensAsync(user, ct);
    }

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken ct)
    {
        var token = _tokenService.CreateAccessToken(user);
        var refreshToken = _tokenService.CreateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays);
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync(ct);

        return new AuthResponse
        {
            AccessToken = token.AccessToken,
            RefreshToken = refreshToken,
            ExpiresIn = token.ExpiresInSeconds,
            User = user.ToDto()
        };
    }
}
