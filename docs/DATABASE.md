# 🗄️ ExamFlow — Database Design

**Engine:** Microsoft SQL Server 2022 (Docker)
**Database:** `ExamFlowDb`

## 1. Entity-Relationship Diagram

```
┌─────────────────────────┐              ┌─────────────────────────┐
│        Subjects          │             │        Students          │
├─────────────────────────┤              ├─────────────────────────┤
│ PK Code        CHAR(3)   │             │ PK Number    INT         │
│    Name        NVARCHAR  │             │    FirstName NVARCHAR    │
│    Grade       TINYINT   │             │    LastName  NVARCHAR    │
│    TeacherFirst NVARCHAR │             │    Grade     TINYINT     │
│    TeacherLast  NVARCHAR │             │                          │
└───────────┬─────────────┘              └────────────┬────────────┘
            │ 1                                        │ 1
            │                                          │
            │ N                                        │ N
            │          ┌─────────────────────────┐     │
            └─────────►│         Exams            │◄────┘
                       ├─────────────────────────┤
                       │ PK Id          INT IDENTITY
                       │ FK SubjectCode CHAR(3)   │
                       │ FK StudentNo   INT       │
                       │    ExamDate    DATE      │
                       │    Grade       TINYINT   │
                       └─────────────────────────┘

┌─────────────────────────┐
│         Users            │   (authentication)
├─────────────────────────┤
│ PK Id          INT IDENTITY
│    Email       NVARCHAR (unique)
│    PasswordHash NVARCHAR
│    Role        NVARCHAR  (Admin | Teacher | Student)
│    CreatedAt   DATETIME2
└─────────────────────────┘
```

**Relationships**
- `Subjects (1) ──< Exams (N)` on `SubjectCode → Subjects.Code`
- `Students (1) ──< Exams (N)` on `StudentNo → Students.Number`
- Deletes on `Subjects` / `Students` are **restricted** when related `Exams` exist.

## 2. Table Specifications

The specification maps the task's original field types to their SQL Server equivalents.

### Subjects (`Dərslər`)
| Column | Task type | SQL Server type | Constraints |
|--------|-----------|-----------------|-------------|
| Code (`Dərsin kodu`) | char(3) | `CHAR(3)` | **PK** |
| Name (`Dərsin adı`) | varchar(30) | `NVARCHAR(30)` | NOT NULL |
| Grade (`Sinifi`) | number(2,0) | `TINYINT` | 1–12 |
| TeacherFirstName (`müəllimin adı`) | varchar(20) | `NVARCHAR(20)` | NOT NULL |
| TeacherLastName (`müəllimin soyadı`) | varchar(20) | `NVARCHAR(20)` | NOT NULL |

### Students (`Şagirdlər`)
| Column | Task type | SQL Server type | Constraints |
|--------|-----------|-----------------|-------------|
| Number (`Nömrəsi`) | number(5,0) | `INT` | **PK** |
| FirstName (`Adı`) | varchar(30) | `NVARCHAR(30)` | NOT NULL |
| LastName (`Soyadı`) | varchar(30) | `NVARCHAR(30)` | NOT NULL |
| Grade (`Sinifi`) | number(2,0) | `TINYINT` | 1–12 |

### Exams (`İmtahanlar`)
| Column | Task type | SQL Server type | Constraints |
|--------|-----------|-----------------|-------------|
| Id | — | `INT IDENTITY` | **PK** (surrogate) |
| SubjectCode (`Dərsin kodu`) | char(3) | `CHAR(3)` | **FK** → Subjects |
| StudentNo (`Şagirdin nömrəsi`) | number(5,0) | `INT` | **FK** → Students |
| ExamDate (`İmtahan tarixi`) | date | `DATE` | NOT NULL |
| Grade (`Qiyməti`) | number(1,0) | `TINYINT` | 2–5 (CHECK) |

> **Note on the primary key:** the task lists Exams with no explicit key. A surrogate `Id` is used so a student may retake the same subject on a different date. A unique index on `(SubjectCode, StudentNo, ExamDate)` prevents accidental duplicates on the same day.

### Users (authentication — added for the auth feature)
| Column | SQL Server type | Constraints |
|--------|-----------------|-------------|
| Id | `INT IDENTITY` | **PK** |
| Email | `NVARCHAR(256)` | UNIQUE, NOT NULL |
| PasswordHash | `NVARCHAR(MAX)` | NOT NULL (BCrypt) |
| Role | `NVARCHAR(20)` | Admin / Teacher / Student |
| CreatedAt | `DATETIME2` | default `SYSUTCDATETIME()` |

## 3. Constraints Summary

- `CK_Subjects_Grade`: Grade BETWEEN 1 AND 12
- `CK_Students_Grade`: Grade BETWEEN 1 AND 12
- `CK_Exams_Grade`: Grade BETWEEN 2 AND 5
- `FK_Exams_Subjects`: ON DELETE NO ACTION
- `FK_Exams_Students`: ON DELETE NO ACTION
- `UX_Exams_Subject_Student_Date`: UNIQUE (SubjectCode, StudentNo, ExamDate)
- `UX_Users_Email`: UNIQUE (Email)

## 4. Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| PK_Subjects | Code | Identity / lookups |
| PK_Students | Number | Identity / lookups |
| IX_Exams_SubjectCode | SubjectCode | Join / per-subject reports |
| IX_Exams_StudentNo | StudentNo | Student report card |
| UX_Exams_Subject_Student_Date | composite | Duplicate prevention |

## 5. Schema Script

The authoritative schema and seed data live in [`database/schema.sql`](../database/schema.sql). In the application, the schema is created and versioned through **EF Core migrations** (`dotnet ef database update`); the SQL script is provided for reference and manual setup.
