# 🏗️ ExamFlow — Architecture

## 1. Goals

ExamFlow records school exam results. The design targets:

- **Separation of concerns** — presentation, business logic, and data access are isolated layers.
- **Security by default** — all write endpoints require authentication; access is role-scoped.
- **Testability** — business logic lives in services behind interfaces.
- **Reproducibility** — the database runs in Docker; the whole stack starts with documented commands.

## 2. High-Level View

```
┌──────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
│  Angular SPA · TypeScript · Tailwind CSS · RxJS · JWT guard    │
└───────────────────────────────┬──────────────────────────────┘
                                 │ HTTPS (JSON + Bearer token)
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│                     ASP.NET Core Web API                       │
│                                                                │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────────┐  │
│  │ Controllers  │──►│  Services     │──►│  Repositories      │ │
│  │ (HTTP layer) │   │ (business)    │   │  (data access)     │ │
│  └──────────────┘   └──────────────┘   └─────────┬─────────┘  │
│         ▲                   ▲                     │            │
│   JWT middleware      Validation /          EF Core DbContext  │
│   Error handler       mapping                     │            │
└───────────────────────────────────────────────────┼──────────┘
                                                      ▼
                                 ┌──────────────────────────────┐
                                 │   MS SQL Server 2022 (Docker) │
                                 └──────────────────────────────┘
```

## 3. Backend Layers

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Controllers** | HTTP routing, model binding, status codes. No business logic. | `ExamsController` |
| **Services** | Business rules, validation, orchestration. | `ExamService` enforces grade 2–5, dependency checks |
| **Repositories** | Data access via EF Core; query composition. | `SubjectRepository` |
| **DbContext** | EF Core mapping, change tracking, migrations. | `ExamFlowDbContext` |
| **DTOs** | Shapes crossing the HTTP boundary (never expose entities directly). | `CreateExamDto`, `ExamDto` |
| **Entities** | Persistence models mapped to tables. | `Subject`, `Student`, `Exam`, `User` |

### Cross-cutting
- **Authentication:** JWT bearer tokens validated by middleware.
- **Authorization:** `[Authorize(Roles = "...")]` per endpoint.
- **Error handling:** a global exception middleware returns a consistent problem shape.
- **Validation:** data annotations + service-level rules.
- **Mapping:** DTO ↔ entity mapping kept explicit and small.

## 4. Frontend Structure

```
src/app/
├── core/            services, guards, interceptors, models
│   ├── auth/        login/register, token storage, JWT interceptor
│   ├── guards/      auth guard, role guard
│   └── services/    ApiService, SubjectService, StudentService, ExamService
├── shared/          reusable UI (table, modal, toast, pagination)
├── features/
│   ├── dashboard/
│   ├── subjects/
│   ├── students/
│   └── exams/
└── layout/          shell, navbar, sidebar, theme toggle
```

- **State:** component-level with RxJS; services hold HTTP calls.
- **HTTP interceptor:** attaches the JWT and handles 401 globally.
- **Routing:** lazy-loaded feature routes behind guards.

## 5. Authentication & Authorization Flow

```
Register ──► password hashed (BCrypt) ──► user stored
Login    ──► credentials verified ──► JWT (short-lived) + refresh token issued
Request  ──► Authorization: Bearer <JWT> ──► middleware validates ──► role checked
Expiry   ──► client uses refresh token ──► new JWT issued
```

Roles:
- **Admin** — manage subjects, students, users; full access.
- **Teacher** — record/view results for subjects; read students.
- **Student** — read own report card only.

## 6. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Exam primary key | Surrogate `Id` identity | Allows a student to retake the same subject on another date |
| Grade range | 2–5 | Matches the national grading scale; enforced in the service |
| Class match (student vs subject) | Not enforced | Keeps enrollment flexible; UI warns instead of blocking |
| Deleting a subject/student with exams | Blocked | Preserves referential integrity and historical results |
| Database hosting | Docker | Host NVMe disk reports 64 KB sectors, which LocalDB cannot start on; the container avoids this and makes setup reproducible |
| Passwords | BCrypt hash | Never store plaintext; salted and slow by design |

## 7. Non-Functional Notes

- **Reproducibility:** `docker compose up` + `dotnet ef database update` recreate the environment anywhere.
- **Security:** secrets via configuration/env, not committed; HTTPS locally; parameterized queries through EF Core.
- **Observability:** structured logging and Swagger for exploration.
- **Portability:** the SQL Server container runs on a non-default port to coexist with other local databases.
