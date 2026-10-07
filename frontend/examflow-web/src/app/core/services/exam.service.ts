import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Exam, PageQuery, PagedResult } from '../models';
import { buildParams } from './http-utils';

export interface ExamInput {
  subjectCode?: string;
  studentNo?: number;
  examDate: string;
  grade: number;
}

export interface ExamQuery extends PageQuery {
  subjectCode?: string;
  studentNo?: number;
}

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private base = `${API_URL}/exams`;

  list(query: ExamQuery): Observable<PagedResult<Exam>> {
    return this.http.get<PagedResult<Exam>>(this.base, { params: buildParams(query) });
  }

  get(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.base}/${id}`);
  }

  create(input: ExamInput): Observable<Exam> {
    return this.http.post<Exam>(this.base, input);
  }

  update(id: number, input: { examDate: string; grade: number }): Observable<Exam> {
    return this.http.put<Exam>(`${this.base}/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
