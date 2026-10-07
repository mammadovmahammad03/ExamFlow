import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { SubjectService } from '../../core/services/subject.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../shared/confirm.service';
import { ExportService } from '../../core/services/export.service';
import { PaginationComponent } from '../../shared/pagination.component';
import { Exam, Student, Subject } from '../../core/models';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, PaginationComponent],
  template: `
    <div class="mx-auto max-w-6xl space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İmtahan nəticələri</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Qiymətlərin qeydiyyatı</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary" (click)="exportExcel()">⬇ Excel</button>
          <button class="btn-secondary" (click)="exportPdf()">⬇ PDF</button>
          @if (canWrite) { <button class="btn-primary" (click)="openCreate()">+ Yeni nəticə</button> }
        </div>
      </div>

      <div class="card flex flex-wrap items-center gap-3 p-4">
        <select class="input max-w-[200px]" [ngModel]="filterSubject()" (ngModelChange)="onFilterSubject($event)">
          <option value="">Bütün fənlər</option>
          @for (s of subjects(); track s.code) { <option [value]="s.code">{{ s.code }} — {{ s.name }}</option> }
        </select>
        <select class="input max-w-[220px]" [ngModel]="filterStudent()" (ngModelChange)="onFilterStudent($event)">
          <option value="">Bütün şagirdlər</option>
          @for (s of students(); track s.number) { <option [value]="s.number">{{ s.number }} — {{ s.firstName }} {{ s.lastName }}</option> }
        </select>
      </div>

      <div class="table-wrap">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Fənn</th><th class="th">Şagird</th><th class="th">Tarix</th><th class="th">Qiymət</th>
              @if (canWrite) { <th class="th text-right">Əməliyyat</th> }
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="canWrite ? 5 : 4">Yüklənir...</td></tr>
            } @else if (items().length === 0) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="canWrite ? 5 : 4">Nəticə tapılmadı</td></tr>
            } @else {
              @for (e of items(); track e.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="td"><span class="font-mono font-semibold text-brand-600">{{ e.subjectCode }}</span> {{ e.subjectName }}</td>
                  <td class="td">{{ e.studentFullName }} <span class="text-slate-400">({{ e.studentNo }})</span></td>
                  <td class="td">{{ e.examDate }}</td>
                  <td class="td"><span class="badge" [class]="gradeClass(e.grade)">{{ e.grade }}</span></td>
                  @if (canWrite) {
                    <td class="td text-right">
                      <button class="btn-ghost px-2 py-1" (click)="openEdit(e)">✏️</button>
                      <button class="btn-ghost px-2 py-1 text-rose-600" (click)="remove(e)">🗑️</button>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <app-pagination [page]="page()" [totalPages]="totalPages()" [totalCount]="totalCount()" (pageChange)="goPage($event)" />
    </div>

    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div class="card w-full max-w-md p-6">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ editing() ? 'Nəticəni redaktə et' : 'Yeni nəticə' }}</h3>
          <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="save()">
            <div>
              <label class="label">Fənn</label>
              <select class="input" formControlName="subjectCode">
                <option value="">Seçin...</option>
                @for (s of subjects(); track s.code) { <option [value]="s.code">{{ s.code }} — {{ s.name }}</option> }
              </select>
            </div>
            <div>
              <label class="label">Şagird</label>
              <select class="input" formControlName="studentNo">
                <option [ngValue]="0">Seçin...</option>
                @for (s of students(); track s.number) { <option [ngValue]="s.number">{{ s.number }} — {{ s.firstName }} {{ s.lastName }}</option> }
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="label">Tarix</label><input class="input" type="date" formControlName="examDate" /></div>
              <div>
                <label class="label">Qiymət</label>
                <select class="input" formControlName="grade">
                  <option [ngValue]="2">2</option><option [ngValue]="3">3</option>
                  <option [ngValue]="4">4</option><option [ngValue]="5">5</option>
                </select>
              </div>
            </div>
            <div class="mt-5 flex justify-end gap-3">
              <button type="button" class="btn-secondary" (click)="modalOpen.set(false)">Ləğv et</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">{{ saving() ? 'Yadda saxlanılır...' : 'Yadda saxla' }}</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class ExamsComponent {
  private service = inject(ExamService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private exporter = inject(ExportService);
  private auth = inject(AuthService);

  canWrite = this.auth.hasRole('Admin', 'Teacher');

  items = signal<Exam[]>([]);
  subjects = signal<Subject[]>([]);
  students = signal<Student[]>([]);
  page = signal(1);
  pageSize = 10;
  totalCount = signal(0);
  totalPages = signal(1);
  loading = signal(true);
  filterSubject = signal('');
  filterStudent = signal('');

  modalOpen = signal(false);
  saving = signal(false);
  editing = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    subjectCode: ['', [Validators.required]],
    studentNo: [0, [Validators.required, Validators.min(1)]],
    examDate: [new Date().toISOString().slice(0, 10), [Validators.required]],
    grade: [5, [Validators.required, Validators.min(2), Validators.max(5)]],
  });

  constructor() {
    this.subjectService.list({ page: 1, pageSize: 100, sortBy: 'code' }).subscribe((r) => this.subjects.set(r.items));
    this.studentService.list({ page: 1, pageSize: 100, sortBy: 'number' }).subscribe((r) => this.students.set(r.items));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .list({
        page: this.page(),
        pageSize: this.pageSize,
        subjectCode: this.filterSubject() || undefined,
        studentNo: this.filterStudent() ? Number(this.filterStudent()) : undefined,
      })
      .subscribe({
        next: (res) => {
          this.items.set(res.items);
          this.totalCount.set(res.totalCount);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onFilterSubject(v: string): void {
    this.filterSubject.set(v);
    this.page.set(1);
    this.load();
  }

  onFilterStudent(v: string): void {
    this.filterStudent.set(v);
    this.page.set(1);
    this.load();
  }

  goPage(p: number): void {
    this.page.set(p);
    this.load();
  }

  gradeClass(grade: number): string {
    if (grade >= 5) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200';
    if (grade >= 4) return 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200';
    if (grade >= 3) return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200';
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ subjectCode: '', studentNo: 0, examDate: new Date().toISOString().slice(0, 10), grade: 5 });
    this.form.controls.subjectCode.enable();
    this.form.controls.studentNo.enable();
    this.modalOpen.set(true);
  }

  openEdit(e: Exam): void {
    this.editing.set(e.id);
    this.form.reset({ subjectCode: e.subjectCode, studentNo: e.studentNo, examDate: e.examDate, grade: e.grade });
    this.form.controls.subjectCode.disable();
    this.form.controls.studentNo.disable();
    this.modalOpen.set(true);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    const id = this.editing();
    const request = id
      ? this.service.update(id, { examDate: v.examDate, grade: v.grade })
      : this.service.create(v);

    request.subscribe({
      next: () => {
        this.toast.success(id ? 'Nəticə yeniləndi.' : 'Nəticə əlavə edildi.');
        this.modalOpen.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  async remove(e: Exam): Promise<void> {
    const ok = await this.confirm.ask(`${e.studentFullName} üçün ${e.subjectName} nəticəsini silmək istədiyinizə əminsiniz?`);
    if (!ok) return;
    this.service.remove(e.id).subscribe({
      next: () => {
        this.toast.success('Nəticə silindi.');
        this.load();
      },
    });
  }

  exportExcel(): void {
    const rows = this.items().map((e) => ({ Fənn: e.subjectName, Kod: e.subjectCode, Şagird: e.studentFullName, Nömrə: e.studentNo, Tarix: e.examDate, Qiymət: e.grade }));
    this.exporter.toExcel(rows, 'imtahanlar', 'İmtahanlar');
  }

  exportPdf(): void {
    const body = this.items().map((e) => [e.subjectCode, e.subjectName, e.studentFullName, e.examDate, e.grade]);
    this.exporter.toPdf('İmtahan nəticələri', ['Kod', 'Fənn', 'Şagird', 'Tarix', 'Qiymət'], body, 'imtahanlar');
  }
}
