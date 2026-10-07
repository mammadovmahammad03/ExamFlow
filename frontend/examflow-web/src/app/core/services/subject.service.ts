import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { PageQuery, PagedResult, Subject } from '../models';
import { buildParams } from './http-utils';

export interface SubjectInput {
  code?: string;
  name: string;
  grade: number;
  teacherFirstName: string;
  teacherLastName: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);
  private base = `${API_URL}/subjects`;

  list(query: PageQuery): Observable<PagedResult<Subject>> {
    return this.http.get<PagedResult<Subject>>(this.base, { params: buildParams(query) });
  }

  get(code: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.base}/${code}`);
  }

  create(input: SubjectInput): Observable<Subject> {
    return this.http.post<Subject>(this.base, input);
  }

  update(code: string, input: SubjectInput): Observable<Subject> {
    return this.http.put<Subject>(`${this.base}/${code}`, input);
  }

  remove(code: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${code}`);
  }
}
