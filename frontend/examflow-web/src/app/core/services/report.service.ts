import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { DashboardSummary, StudentReport, SubjectStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);

  dashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${API_URL}/dashboard/summary`);
  }

  studentReport(number: number): Observable<StudentReport> {
    return this.http.get<StudentReport>(`${API_URL}/reports/student/${number}`);
  }

  subjectStats(code: string): Observable<SubjectStats> {
    return this.http.get<SubjectStats>(`${API_URL}/reports/subject/${code}`);
  }
}
