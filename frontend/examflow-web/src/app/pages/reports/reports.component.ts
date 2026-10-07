import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { SubjectService } from '../../core/services/subject.service';
import { StudentService } from '../../core/services/student.service';
import { ExportService } from '../../core/services/export.service';
import { Student, StudentReport, Subject, SubjectStats } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Hesabatlar</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Şagird hesabat kartı və fənn statistikası</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="card p-5">
          <h3 class="mb-3 font-semibold text-slate-700 dark:text-slate-200">🎓 Şagird hesabat kartı</h3>
          <select class="input" [ngModel]="selectedStudent()" (ngModelChange)="loadStudent($event)">
            <option value="">Şagird seçin...</option>
            @for (s of students(); track s.number) { <option [value]="s.number">{{ s.number }} — {{ s.firstName }} {{ s.lastName }}</option> }
          </select>

          @if (report(); as r) {
            <div class="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-800 dark:text-white">{{ r.firstName }} {{ r.lastName }}</div>
                  <div class="text-xs text-slate-500">Nömrə: {{ r.number }} · {{ r.grade }}-ci sinif</div>
                </div>
                <div class="text-right">
                  <div class="text-xs uppercase text-slate-400">Orta</div>
                  <div class="text-2xl font-extrabold text-brand-600">{{ r.averageGrade }}</div>
                </div>
              </div>
            </div>

            @if (r.results.length > 0) {
              <div class="table-wrap mt-3">
                <table class="w-full">
                  <thead><tr><th class="th">Fənn</th><th class="th">Tarix</th><th class="th">Qiymət</th></tr></thead>
                  <tbody>
                    @for (row of r.results; track $index) {
                      <tr><td class="td">{{ row.subjectName }}</td><td class="td">{{ row.examDate }}</td><td class="td font-semibold">{{ row.grade }}</td></tr>
                    }
                  </tbody>
                </table>
              </div>
              <button class="btn-secondary mt-3" (click)="exportReport(r)">⬇ PDF olaraq yüklə</button>
            } @else {
              <p class="mt-3 text-sm text-slate-400">Bu şagird üçün nəticə yoxdur.</p>
            }
          }
        </div>

        <div class="card p-5">
          <h3 class="mb-3 font-semibold text-slate-700 dark:text-slate-200">📚 Fənn statistikası</h3>
          <select class="input" [ngModel]="selectedSubject()" (ngModelChange)="loadSubject($event)">
            <option value="">Fənn seçin...</option>
            @for (s of subjects(); track s.code) { <option [value]="s.code">{{ s.code }} — {{ s.name }}</option> }
          </select>

          @if (stats(); as st) {
            <div class="mt-4">
              <div class="font-bold text-slate-800 dark:text-white">{{ st.subjectName }} <span class="font-mono text-brand-600">({{ st.subjectCode }})</span></div>
              <div class="mt-3 grid grid-cols-2 gap-3">
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><div class="text-xs uppercase text-slate-400">İmtahan sayı</div><div class="text-xl font-bold text-slate-700 dark:text-slate-100">{{ st.examCount }}</div></div>
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><div class="text-xs uppercase text-slate-400">Orta qiymət</div><div class="text-xl font-bold text-brand-600">{{ st.averageGrade }}</div></div>
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><div class="text-xs uppercase text-slate-400">Keçmə faizi</div><div class="text-xl font-bold text-emerald-600">{{ (st.passRate * 100).toFixed(0) }}%</div></div>
                <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><div class="text-xs uppercase text-slate-400">Ən yüksək / aşağı</div><div class="text-xl font-bold text-slate-700 dark:text-slate-100">{{ st.highestGrade }} / {{ st.lowestGrade }}</div></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent {
  private reports = inject(ReportService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private exporter = inject(ExportService);

  students = signal<Student[]>([]);
  subjects = signal<Subject[]>([]);
  selectedStudent = signal('');
  selectedSubject = signal('');
  report = signal<StudentReport | null>(null);
  stats = signal<SubjectStats | null>(null);

  constructor() {
    this.studentService.list({ page: 1, pageSize: 100, sortBy: 'number' }).subscribe((r) => this.students.set(r.items));
    this.subjectService.list({ page: 1, pageSize: 100, sortBy: 'code' }).subscribe((r) => this.subjects.set(r.items));
  }

  loadStudent(value: string): void {
    this.selectedStudent.set(value);
    if (!value) {
      this.report.set(null);
      return;
    }
    this.reports.studentReport(Number(value)).subscribe((r) => this.report.set(r));
  }

  loadSubject(value: string): void {
    this.selectedSubject.set(value);
    if (!value) {
      this.stats.set(null);
      return;
    }
    this.reports.subjectStats(value).subscribe((s) => this.stats.set(s));
  }

  exportReport(r: StudentReport): void {
    const body = r.results.map((row) => [row.subjectCode, row.subjectName, row.examDate, row.grade]);
    this.exporter.toPdf(
      `Hesabat kartı — ${r.firstName} ${r.lastName} (Orta: ${r.averageGrade})`,
      ['Kod', 'Fənn', 'Tarix', 'Qiymət'],
      body,
      `hesabat-${r.number}`,
    );
  }
}
