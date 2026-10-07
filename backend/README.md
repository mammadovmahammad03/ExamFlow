# ExamFlow — Backend

ASP.NET Core 9 Web API built with **Clean Architecture** and Entity Framework Core.

## Projects

```
src/
├── ExamFlow.Domain          Entities, domain rules (no dependencies)
├── ExamFlow.Application      DTOs, interfaces, services, business logic
├── ExamFlow.Infrastructure   EF Core, repositories, Unit of Work, JWT, seeding
└── ExamFlow.Api              Controllers, middleware, DI composition root
```

**Dependency direction:** `Api → Infrastructure → Application → Domain`

## Patterns

- **Repository** + **Unit of Work** — data access abstraction (`IUnitOfWork`, `IGenericRepository<T>`)
- **Dependency Injection** — `AddApplication()` / `AddInfrastructure()` extension methods
- **DTO** — request/response shapes separate from entities
- **Options** — `JwtSettings` bound from configuration
- **Service layer** — business logic behind interfaces
- **Middleware** — global exception handling mapped to consistent JSON errors

## Running

```bash
# from repo root: start SQL Server
docker compose up -d

# run the API (schema is migrated + seeded automatically)
cd backend
dotnet run --project src/ExamFlow.Api
```

- API: `http://localhost:5080`
- Swagger: `http://localhost:5080/swagger`

## EF Core migrations

```bash
# add a migration
dotnet ef migrations add <Name> \
  --project src/ExamFlow.Infrastructure \
  --startup-project src/ExamFlow.Api \
  --output-dir Persistence/Migrations

# apply manually (otherwise applied on startup)
dotnet ef database update \
  --project src/ExamFlow.Infrastructure \
  --startup-project src/ExamFlow.Api
```

## Configuration

`src/ExamFlow.Api/appsettings.json`:
- `ConnectionStrings:Default` — SQL Server connection (Docker, port 14330)
- `Jwt` — issuer, audience, signing key, access-token lifetime

## Security

- Passwords hashed with **BCrypt** (work factor 11)
- **JWT** bearer authentication, role-based authorization (`Admin`, `Teacher`, `Student`)
- Refresh tokens stored per user with expiry

See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) and [../docs/API.md](../docs/API.md) for details.
