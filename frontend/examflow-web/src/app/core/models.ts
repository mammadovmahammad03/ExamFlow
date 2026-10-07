export type Role = 'Admin' | 'Teacher' | 'Student';

export interface UserDto {
  id: number;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface Subject {
  code: string;
  name: string;
  grade: number;
  teacherFirstName: string;
  teacherLastName: string;
  examCount: number;
}

export interface Student {
  number: number;
  firstName: string;
  lastName: string;
  grade: number;
  examCount: number;
}

export interface Exam {
  id: number;
  subjectCode: string;
  subjectName: string;
  studentNo: number;
  studentFullName: string;
  examDate: string;
  grade: number;
}

export interface SubjectAverage {
  subjectCode: string;
  subjectName: string;
  averageGrade: number;
  examCount: number;
}

export interface GradeDistribution {
  grade: number;
  count: number;
}

export interface ClassPerformance {
  grade: number;
  averageGrade: number;
  examCount: number;
}

export interface DashboardSummary {
  subjects: number;
  students: number;
  exams: number;
  averageGrade: number;
  passRate: number;
  subjectAverages: SubjectAverage[];
  gradeDistribution: GradeDistribution[];
  classPerformance: ClassPerformance[];
}

export interface StudentReportRow {
  subjectCode: string;
  subjectName: string;
  examDate: string;
  grade: number;
}

export interface StudentReport {
  number: number;
  firstName: string;
  lastName: string;
  grade: number;
  averageGrade: number;
  results: StudentReportRow[];
}

export interface SubjectStats {
  subjectCode: string;
  subjectName: string;
  examCount: number;
  averageGrade: number;
  passRate: number;
  highestGrade: number;
  lowestGrade: number;
}
