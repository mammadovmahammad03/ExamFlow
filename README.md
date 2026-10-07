<div align="center">

# 🎓 ExamFlow

### School Exam Results Management System

A full-stack application for registering and managing school exam results — subjects, students, and grades — with authentication, role-based access, dashboards, and a modern UI.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📖 Overview

**ExamFlow** digitizes the exam-results workflow of a secondary school. Administrators register the **subjects** that will be examined, enroll **students**, and then record **exam results** (grades) linking a student to a subject on a given date. Teachers record and view grades for their subjects; students see their own report card.

This repository was built as a technical assessment and is intentionally production-shaped: layered backend, typed frontend, containerized database, and complete documentation.

## ✨ Features

| Area | Capability |
|------|------------|
| 🔐 **Auth** | Register / Login with JWT + refresh tokens, BCrypt password hashing |
| 👥 **Roles** | `Admin`, `Teacher`, `Student` — route guards on client and server |
| 📚 **Subjects** | Full CRUD, search, sort, pagination |
| 🧑‍🎓 **Students** | Full CRUD, search, sort, pagination |
| 📝 **Exams** | Record results, validation (grade 2–5), block deletes with dependencies |
| 📊 **Dashboard** | Totals, average grade, pass rate, per-subject stats |
| 📈 **Reports** | Student report card, per-subject analytics |
| 🎨 **UI/UX** | Tailwind CSS, responsive, dark/light mode, toasts, loading & empty states |
| 📜 **API docs** | Swagger / OpenAPI |

## 🏗️ Architecture

```
┌─────────────────────┐      HTTPS / JWT      ┌──────────────────────────┐
│   Angular SPA        │ ───────────────────► │   ASP.NET Core Web API    │
│  (TypeScript +       │ ◄─────────────────── │   Controllers             │
│   Tailwind CSS)      │        JSON          │     │                      │
└─────────────────────┘                       │   Services (business)     │
                                               │     │                      │
                                               │   Repositories + EF Core  │
                                               │     │                      │
                                               │   MS SQL Server (Docker)  │
                                               └──────────────────────────┘
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## 🧰 Tech Stack

- **Frontend:** Angular 20, TypeScript, Tailwind CSS, RxJS, Chart.js
- **Backend:** ASP.NET Core 9 Web API, Entity Framework Core, JWT, BCrypt
- **Database:** Microsoft SQL Server 2022 (via Docker)
- **Tooling:** Docker Compose, Swagger
- **Export:** SheetJS (Excel), jsPDF (PDF)

## 🚀 Getting Started

### Prerequisites
- [.NET SDK 9+](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Start the database
```bash
docker compose up -d
```
SQL Server starts in a container on port **14330**.

### 2. Run the backend
```bash
cd backend
dotnet run --project src/ExamFlow.Api
```
The database schema is created and seeded automatically on first run (EF Core migrations).
API: `http://localhost:5080` · Swagger: `http://localhost:5080/swagger`

### 3. Run the frontend
```bash
cd frontend/examflow-web
npm install
npm start
```
App: `http://localhost:4200`

### Demo accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@examflow.local` | `Admin123!` |
| Teacher | `teacher@examflow.local` | `Teacher123!` |
| Student | `student@examflow.local` | `Student123!` |

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [Architecture](docs/ARCHITECTURE.md) | System design, layers, decisions |
| [Database](docs/DATABASE.md) | ER model, tables, relationships |
| [API](docs/API.md) | Endpoints, requests, responses |
| [Business Overview (PDF)](docs/ExamFlow-Business-Overview.pdf) | Non-technical project brief |

## 📁 Repository Structure

```
ExamFlow/
├── backend/        ASP.NET Core Web API
├── frontend/       Angular application
├── database/       SQL scripts & seed data
├── docs/           Architecture, DB, API, business PDF
├── docker-compose.yml
└── README.md
```

## 👤 Author

**Mahammad Mammadov** — [@mammadovmahammad03](https://github.com/mammadovmahammad03)

## 📄 License

MIT
