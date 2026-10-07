import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { PageQuery, PagedResult, Student } from '../models';
import { buildParams } from './http-utils';

export interface StudentInput {
  number?: number;
  firstName: string;
  lastName: string;
  grade: number;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private base = `${API_URL}/students`;

  list(query: PageQuery): Observable<PagedResult<Student>> {
    return this.http.get<PagedResult<Student>>(this.base, { params: buildParams(query) });
  }

  get(number: number): Observable<Student> {
    return this.http.get<Student>(`${this.base}/${number}`);
  }

  create(input: StudentInput): Observable<Student> {
    return this.http.post<Student>(this.base, input);
  }

  update(number: number, input: StudentInput): Observable<Student> {
    return this.http.put<Student>(`${this.base}/${number}`, input);
  }

  remove(number: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${number}`);
  }
}
