<div align="center">

# 🎓 ExamFlow

### School Exam Results Management System · Məktəb İmtahan Nəticələri İdarəetmə Sistemi

A full-stack application for registering and managing school exam results — subjects, students and grades — with authentication, role-based access, dashboards, reporting and a modern UI.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

**[🇬🇧 English](#-english)  ·  [🇦🇿 Azərbaycanca](#-azərbaycanca)**

</div>

---

<a id="-english"></a>

## 🇬🇧 English

### 📖 Overview

**ExamFlow** digitizes the exam-results workflow of a secondary school. Administrators register the **subjects** that will be examined, enroll **students**, and record **exam results** (grades) linking a student to a subject on a given date. Teachers record and review grades for their subjects, while students view their own report card.

The project is intentionally production-shaped: a layered (Clean Architecture) backend, a typed Angular frontend, a containerized database, and complete documentation.

📄 **Business overview (PDF, Azerbaijani):** [docs/ExamFlow-Business-Overview.pdf](docs/ExamFlow-Business-Overview.pdf)

### ✨ Features

| Area | Capability |
|------|------------|
| 🔐 **Auth** | Register / Login with JWT + refresh tokens, BCrypt password hashing |
| 👥 **Roles** | `Admin`, `Teacher`, `Student` — guards on client and server |
| 📚 **Subjects** | Full CRUD, search, sort, pagination |
| 🧑‍🎓 **Students** | Full CRUD, search, sort, pagination |
| 📝 **Exams** | Record results, grade validation (2–5), duplicate prevention |
| 📊 **Dashboard** | Totals, average grade, pass rate, interactive charts |
| 📈 **Reports** | Student report card, per-subject statistics |
| 📄 **Export** | Excel and PDF export of lists and report cards |
| 🎨 **UI/UX** | Tailwind CSS, responsive, dark/light mode, toasts, empty & loading states |
| 📜 **API docs** | Swagger / OpenAPI |

### 🧰 Tech Stack

- **Frontend:** Angular 20, TypeScript, Tailwind CSS, RxJS, Chart.js, SheetJS, jsPDF
- **Backend:** ASP.NET Core 9 Web API, Entity Framework Core, JWT, BCrypt
- **Database:** Microsoft SQL Server 2022 (via Docker)
- **Tooling:** Docker Compose, Swagger

### 🏗️ Architecture

```
┌──────────────────┐   HTTPS / JWT   ┌──────────────────────────┐
│   Angular SPA     │ ──────────────► │   ASP.NET Core Web API    │
│  (TypeScript +    │ ◄────────────── │   Controllers             │
│   Tailwind CSS)   │      JSON       │     → Services (business) │
└──────────────────┘                 │     → Repositories (EF)   │
                                      │     → MS SQL Server        │
                                      └──────────────────────────┘
```

Clean Architecture layers: `Api → Infrastructure → Application → Domain`.
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DATABASE.md](docs/DATABASE.md), [docs/API.md](docs/API.md).

### 🚀 Getting Started

**Prerequisites:** [.NET SDK 9+](https://dotnet.microsoft.com/download) · [Node.js 22+](https://nodejs.org/) · [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1) Start the database (SQL Server in Docker, port 14330)
docker compose up -d

# 2) Run the backend — schema is migrated & seeded automatically on first run
cd backend
dotnet run --project src/ExamFlow.Api
#   API:     http://localhost:5080
#   Swagger: http://localhost:5080/swagger

# 3) Run the frontend (in a second terminal)
cd frontend/examflow-web
npm install
npm start
#   App: http://localhost:4200
```

### 🔑 Demo accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@examflow.local` | `Admin123!` |
| **Teacher** | `teacher@examflow.local` | `Teacher123!` |
| **Student** | `student@examflow.local` | `Student123!` |

### 📁 Repository Structure

```
ExamFlow/
├── backend/        ASP.NET Core Web API (Clean Architecture)
│   └── src/        Domain · Application · Infrastructure · Api
├── frontend/       Angular 20 application (examflow-web)
├── database/       SQL schema & seed script
├── docs/           Architecture, Database, API, Business PDF
├── docker-compose.yml
└── README.md
```

---

<a id="-azərbaycanca"></a>

## 🇦🇿 Azərbaycanca

### 📖 Haqqında

**ExamFlow** orta məktəbin imtahan nəticələri prosesini rəqəmsallaşdırır. Administratorlar imtahan veriləcək **fənləri** qeyd edir, **şagirdləri** əlavə edir və hər şagirdin fənn və tarix üzrə **imtahan nəticəsini (qiymətini)** yazır. Müəllimlər öz fənləri üzrə qiymətləri daxil edib baxır, şagirdlər isə öz hesabat kartını görür.

Layihə qəsdən real istehsal səviyyəsində qurulub: qatlı (Clean Architecture) backend, tipli Angular frontend, konteynerləşdirilmiş verilənlər bazası və tam sənədləşmə.

📄 **Biznes icmalı (PDF, Azərbaycanca):** [docs/ExamFlow-Business-Overview.pdf](docs/ExamFlow-Business-Overview.pdf)

### ✨ Funksiyalar

| Sahə | İmkan |
|------|-------|
| 🔐 **Autentifikasiya** | JWT + refresh token ilə qeydiyyat/giriş, BCrypt parol hashlənməsi |
| 👥 **Rollar** | `Admin`, `Müəllim`, `Şagird` — həm client, həm server tərəfdə qoruma |
| 📚 **Fənlər** | Tam CRUD, axtarış, sıralama, səhifələmə |
| 🧑‍🎓 **Şagirdlər** | Tam CRUD, axtarış, sıralama, səhifələmə |
| 📝 **İmtahanlar** | Nəticə qeydi, qiymət validasiyası (2–5), dublikatın qarşısı |
| 📊 **İdarə paneli** | Ümumi sayılar, orta qiymət, keçmə faizi, interaktiv qrafiklər |
| 📈 **Hesabatlar** | Şagird hesabat kartı, fənn üzrə statistika |
| 📄 **Export** | Siyahıların və hesabat kartlarının Excel/PDF export-u |
| 🎨 **UI/UX** | Tailwind CSS, responsive, dark/light rejim, toast bildirişlər |
| 📜 **API sənədi** | Swagger / OpenAPI |

### 🧰 Texnologiyalar

- **Frontend:** Angular 20, TypeScript, Tailwind CSS, RxJS, Chart.js, SheetJS, jsPDF
- **Backend:** ASP.NET Core 9 Web API, Entity Framework Core, JWT, BCrypt
- **Verilənlər bazası:** Microsoft SQL Server 2022 (Docker)
- **Alətlər:** Docker Compose, Swagger

### 🏗️ Arxitektura

```
┌──────────────────┐   HTTPS / JWT   ┌──────────────────────────┐
│   Angular SPA     │ ──────────────► │   ASP.NET Core Web API    │
│  (TypeScript +    │ ◄────────────── │   Controller-lər          │
│   Tailwind CSS)   │      JSON       │     → Servislər (məntiq)  │
└──────────────────┘                 │     → Repository-lər (EF) │
                                      │     → MS SQL Server        │
                                      └──────────────────────────┘
```

Clean Architecture qatları: `Api → Infrastructure → Application → Domain`.
Ətraflı: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DATABASE.md](docs/DATABASE.md), [docs/API.md](docs/API.md).

### 🚀 Necə işə salmalı

**Tələblər:** [.NET SDK 9+](https://dotnet.microsoft.com/download) · [Node.js 22+](https://nodejs.org/) · [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1) Verilənlər bazasını başlat (Docker-də SQL Server, port 14330)
docker compose up -d

# 2) Backend-i işə sal — schema ilk işə salışda avtomatik migrate + seed olunur
cd backend
dotnet run --project src/ExamFlow.Api
#   API:     http://localhost:5080
#   Swagger: http://localhost:5080/swagger

# 3) Frontend-i işə sal (ikinci terminalda)
cd frontend/examflow-web
npm install
npm start
#   Tətbiq: http://localhost:4200
```

### 🔑 Demo hesablar

| Rol | Email | Şifrə |
|-----|-------|-------|
| **Admin** | `admin@examflow.local` | `Admin123!` |
| **Müəllim** | `teacher@examflow.local` | `Teacher123!` |
| **Şagird** | `student@examflow.local` | `Student123!` |

### 📁 Layihə strukturu

```
ExamFlow/
├── backend/        ASP.NET Core Web API (Clean Architecture)
│   └── src/        Domain · Application · Infrastructure · Api
├── frontend/       Angular 20 tətbiqi (examflow-web)
├── database/       SQL schema və seed scripti
├── docs/           Arxitektura, Baza, API, Biznes PDF
├── docker-compose.yml
└── README.md
```

---

<div align="center">

**Author · Müəllif:** Mahammad Mammadov — [@mammadovmahammad03](https://github.com/mammadovmahammad03)

License · Lisenziya: MIT

</div>
