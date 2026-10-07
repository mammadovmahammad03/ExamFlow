IF DB_ID('ExamFlowDb') IS NULL
    CREATE DATABASE ExamFlowDb;
GO

USE ExamFlowDb;
GO

IF OBJECT_ID('dbo.Exams', 'U') IS NOT NULL DROP TABLE dbo.Exams;
IF OBJECT_ID('dbo.Subjects', 'U') IS NOT NULL DROP TABLE dbo.Subjects;
IF OBJECT_ID('dbo.Students', 'U') IS NOT NULL DROP TABLE dbo.Students;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Subjects (
    Code             CHAR(3)       NOT NULL CONSTRAINT PK_Subjects PRIMARY KEY,
    Name             NVARCHAR(30)  NOT NULL,
    Grade            TINYINT       NOT NULL CONSTRAINT CK_Subjects_Grade CHECK (Grade BETWEEN 1 AND 12),
    TeacherFirstName NVARCHAR(20)  NOT NULL,
    TeacherLastName  NVARCHAR(20)  NOT NULL
);
GO

CREATE TABLE dbo.Students (
    Number    INT           NOT NULL CONSTRAINT PK_Students PRIMARY KEY,
    FirstName NVARCHAR(30)  NOT NULL,
    LastName  NVARCHAR(30)  NOT NULL,
    Grade     TINYINT       NOT NULL CONSTRAINT CK_Students_Grade CHECK (Grade BETWEEN 1 AND 12)
);
GO

CREATE TABLE dbo.Exams (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Exams PRIMARY KEY,
    SubjectCode CHAR(3)  NOT NULL,
    StudentNo   INT      NOT NULL,
    ExamDate    DATE     NOT NULL,
    Grade       TINYINT  NOT NULL CONSTRAINT CK_Exams_Grade CHECK (Grade BETWEEN 2 AND 5),
    CONSTRAINT FK_Exams_Subjects FOREIGN KEY (SubjectCode) REFERENCES dbo.Subjects(Code) ON DELETE NO ACTION,
    CONSTRAINT FK_Exams_Students FOREIGN KEY (StudentNo) REFERENCES dbo.Students(Number) ON DELETE NO ACTION,
    CONSTRAINT UX_Exams_Subject_Student_Date UNIQUE (SubjectCode, StudentNo, ExamDate)
);
GO

CREATE TABLE dbo.Users (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
    Email        NVARCHAR(256) NOT NULL CONSTRAINT UX_Users_Email UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role         NVARCHAR(20)  NOT NULL,
    CreatedAt    DATETIME2     NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME()
);
GO

CREATE INDEX IX_Exams_SubjectCode ON dbo.Exams(SubjectCode);
CREATE INDEX IX_Exams_StudentNo   ON dbo.Exams(StudentNo);
GO

INSERT INTO dbo.Subjects (Code, Name, Grade, TeacherFirstName, TeacherLastName) VALUES
    ('MAT', N'Mathematics', 9, N'Aysel', N'Mammadova'),
    ('PHY', N'Physics',     9, N'Elnur', N'Huseynov'),
    ('CHE', N'Chemistry',   9, N'Nigar', N'Aliyeva'),
    ('BIO', N'Biology',     9, N'Rashad', N'Guliyev'),
    ('HIS', N'History',    10, N'Leyla', N'Ismayilova');
GO

INSERT INTO dbo.Students (Number, FirstName, LastName, Grade) VALUES
    (10001, N'Elvin',  N'Aliyev',    9),
    (10002, N'Nurlan', N'Mammadov',  9),
    (10003, N'Aysu',   N'Hasanova',  9),
    (10004, N'Kamran', N'Ibrahimov', 9),
    (10005, N'Leyla',  N'Quliyeva',  10);
GO

INSERT INTO dbo.Exams (SubjectCode, StudentNo, ExamDate, Grade) VALUES
    ('MAT', 10001, '2026-06-10', 5),
    ('MAT', 10002, '2026-06-10', 4),
    ('PHY', 10001, '2026-06-12', 4),
    ('PHY', 10003, '2026-06-12', 3),
    ('CHE', 10004, '2026-06-14', 5),
    ('HIS', 10005, '2026-06-16', 4);
GO
