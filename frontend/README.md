# ExamFlow — Frontend

Angular 20 single-page application styled with **Tailwind CSS**.

## Running

```bash
cd examflow-web
npm install
npm start
```
App runs at `http://localhost:4200` and talks to the API at `http://localhost:5080/api`
(configured in `src/app/core/config.ts`).

> Start the backend and database first — see the [backend README](../backend/README.md).

## Structure

```
examflow-web/src/app/
├── core/
│   ├── auth/            AuthService, JWT interceptor, auth & role guards
│   ├── services/        data services, theme, toast, export, http utils
│   ├── config.ts        API URL and storage keys
│   └── models.ts        typed API contracts
├── shared/              toast, confirm dialog, pagination, chart components
├── layout/              authenticated shell (sidebar, topbar, theme toggle)
└── pages/
    ├── auth/            login, register
    ├── dashboard/       stats + charts
    ├── subjects/        CRUD + search + export
    ├── students/        CRUD + search + export
    ├── exams/           CRUD + filters + export
    └── reports/         student report card, subject statistics
```

## Features

- **Auth** — JWT login/register, token stored in `localStorage`, auto-attached via HTTP interceptor
- **Role-based UI** — navigation and actions adapt to `Admin` / `Teacher` / `Student`
- **Dashboard** — KPI cards and Chart.js charts (subject averages, grade distribution, class performance)
- **CRUD** — subjects, students, exams with modal forms, validation, search, pagination
- **Reports** — student report card and per-subject statistics
- **Export** — Excel (SheetJS) and PDF (jsPDF)
- **Theming** — dark / light mode with persisted preference
- **UX** — toast notifications, confirm dialogs, loading & empty states, responsive layout

## Build

```bash
npm run build
```
Output is written to `dist/`.
