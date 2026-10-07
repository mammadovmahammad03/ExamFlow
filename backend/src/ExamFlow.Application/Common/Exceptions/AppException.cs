namespace ExamFlow.Application.Common.Exceptions;

public abstract class AppException : Exception
{
    public abstract int StatusCode { get; }

    protected AppException(string message) : base(message) { }
}

public sealed class NotFoundException : AppException
{
    public override int StatusCode => 404;
    public NotFoundException(string message) : base(message) { }
    public static NotFoundException For(string entity, object key) =>
        new($"{entity} '{key}' tapılmadı.");
}

public sealed class ConflictException : AppException
{
    public override int StatusCode => 409;
    public ConflictException(string message) : base(message) { }
}

public sealed class ValidationException : AppException
{
    public override int StatusCode => 400;
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public ValidationException(string message) : base(message)
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IReadOnlyDictionary<string, string[]> errors)
        : base("Bir və ya bir neçə validasiya xətası baş verdi.")
    {
        Errors = errors;
    }
}

public sealed class UnauthorizedException : AppException
{
    public override int StatusCode => 401;
    public UnauthorizedException(string message) : base(message) { }
}

public sealed class ForbiddenException : AppException
{
    public override int StatusCode => 403;
    public ForbiddenException(string message) : base(message) { }
}
