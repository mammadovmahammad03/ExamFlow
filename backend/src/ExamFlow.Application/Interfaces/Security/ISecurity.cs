using ExamFlow.Domain.Entities;

namespace ExamFlow.Application.Interfaces.Security;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public record TokenResult(string AccessToken, int ExpiresInSeconds);

public interface ITokenService
{
    TokenResult CreateAccessToken(User user);
    string CreateRefreshToken();
}
