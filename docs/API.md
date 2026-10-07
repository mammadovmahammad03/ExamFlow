# 🔌 ExamFlow — API Reference

**Base URL:** `http://localhost:5080/api`
**Auth:** JWT Bearer — send `Authorization: Bearer <token>` on protected routes.
**Format:** JSON. Interactive docs available at `http://localhost:5080/swagger`.

## Conventions

- `200 OK` success with body · `201 Created` on create · `204 No Content` on delete
- `400 Bad Request` validation error · `401 Unauthorized` · `403 Forbidden` · `404 Not Found` · `409 Conflict` (dependency/duplicate)
- List endpoints accept `?page=1&pageSize=10&search=&sortBy=&sortDir=asc`.

---

## 🔐 Auth

### POST `/auth/register`
```json
{ "email": "teacher@examflow.local", "password": "Pass123!", "role": "Teacher" }
```
→ `201` `{ "id": 2, "email": "teacher@examflow.local", "role": "Teacher" }`

### POST `/auth/login`
```json
{ "email": "admin@examflow.local", "password": "Admin123!" }
```
→ `200`
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "a1b2c3...",
  "expiresIn": 3600,
  "user": { "id": 1, "email": "admin@examflow.local", "role": "Admin" }
}
```

### POST `/auth/refresh`
```json
{ "refreshToken": "a1b2c3..." }
```
→ `200` new token pair.

---

## 📚 Subjects  *(Admin: write · all authenticated: read)*

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/subjects` | Paged list (search, sort) |
| GET | `/subjects/{code}` | Single subject |
| POST | `/subjects` | Create |
| PUT | `/subjects/{code}` | Update |
| DELETE | `/subjects/{code}` | Delete (409 if exams exist) |

**Create / Update body**
```json
{
  "code": "MAT",
  "name": "Mathematics",
  "grade": 9,
  "teacherFirstName": "Aysel",
  "teacherLastName": "Mammadova"
}
```

---

## 🧑‍🎓 Students  *(Admin: write · Admin/Teacher: read)*

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/students` | Paged list |
| GET | `/students/{number}` | Single student |
| POST | `/students` | Create |
| PUT | `/students/{number}` | Update |
| DELETE | `/students/{number}` | Delete (409 if exams exist) |

**Create / Update body**
```json
{ "number": 10234, "firstName": "Elvin", "lastName": "Aliyev", "grade": 9 }
```

---

## 📝 Exams  *(Admin/Teacher: write · owner Student: read own)*

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/exams` | Paged list (filter by subject/student) |
| GET | `/exams/{id}` | Single exam result |
| POST | `/exams` | Record a result |
| PUT | `/exams/{id}` | Update a result |
| DELETE | `/exams/{id}` | Delete a result |

**Create / Update body**
```json
{ "subjectCode": "MAT", "studentNo": 10234, "examDate": "2026-06-15", "grade": 5 }
```
Validation: `subjectCode` and `studentNo` must exist; `grade` ∈ [2,5]; no duplicate on the same `(subject, student, date)`.

---

## 📊 Dashboard & Reports  *(Admin/Teacher)*

| Method | Route | Returns |
|--------|-------|---------|
| GET | `/dashboard/summary` | totals, overall average, pass rate |
| GET | `/reports/student/{number}` | a student's full report card |
| GET | `/reports/subject/{code}` | per-subject statistics |

**`/dashboard/summary`**
```json
{
  "subjects": 12,
  "students": 340,
  "exams": 1580,
  "averageGrade": 4.1,
  "passRate": 0.86
}
```

**`/reports/student/{number}`**
```json
{
  "student": { "number": 10234, "firstName": "Elvin", "lastName": "Aliyev", "grade": 9 },
  "results": [
    { "subjectCode": "MAT", "subjectName": "Mathematics", "examDate": "2026-06-15", "grade": 5 },
    { "subjectCode": "PHY", "subjectName": "Physics", "examDate": "2026-06-18", "grade": 4 }
  ],
  "averageGrade": 4.5
}
```

---

## Error shape
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Cannot delete subject 'MAT': 24 exam records reference it."
}
```
