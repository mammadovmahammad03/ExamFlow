import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../core/services/subject.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../shared/confirm.service';
import { ExportService } from '../../core/services/export.service';
import { PaginationComponent } from '../../shared/pagination.component';
import { Subject } from '../../core/models';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, PaginationComponent],
  template: `
    <div class="mx-auto max-w-6xl space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Fənlər</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">İmtahan fənlərinin idarə edilməsi</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary" (click)="exportExcel()">⬇ Excel</button>
          <button class="btn-secondary" (click)="exportPdf()">⬇ PDF</button>
          @if (isAdmin) {
            <button class="btn-primary" (click)="openCreate()">+ Yeni fənn</button>
          }
        </div>
      </div>

      <div class="card p-4">
        <input class="input max-w-xs" placeholder="🔍 Axtar (kod, ad, müəllim)" [ngModel]="search()" (ngModelChange)="onSearch($event)" />
      </div>

      <div class="table-wrap">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Kod</th><th class="th">Ad</th><th class="th">Sinif</th>
              <th class="th">Müəllim</th><th class="th">İmtahan</th>
              @if (isAdmin) { <th class="th text-right">Əməliyyat</th> }
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="isAdmin ? 6 : 5">Yüklənir...</td></tr>
            } @else if (items().length === 0) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="isAdmin ? 6 : 5">Nəticə tapılmadı</td></tr>
            } @else {
              @for (s of items(); track s.code) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="td font-mono font-semibold text-brand-600">{{ s.code }}</td>
                  <td class="td font-medium">{{ s.name }}</td>
                  <td class="td">{{ s.grade }}</td>
                  <td class="td">{{ s.teacherFirstName }} {{ s.teacherLastName }}</td>
                  <td class="td"><span class="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ s.examCount }}</span></td>
                  @if (isAdmin) {
                    <td class="td text-right">
                      <button class="btn-ghost px-2 py-1" (click)="openEdit(s)">✏️</button>
                      <button class="btn-ghost px-2 py-1 text-rose-600" (click)="remove(s)">🗑️</button>
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
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ editing() ? 'Fənni redaktə et' : 'Yeni fənn' }}</h3>
          <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="save()">
            <div>
              <label class="label">Kod (3 simvol)</label>
              <input class="input uppercase" formControlName="code" maxlength="3" placeholder="MAT" />
            </div>
            <div>
              <label class="label">Ad</label>
              <input class="input" formControlName="name" placeholder="Mathematics" />
            </div>
            <div>
              <label class="label">Sinif</label>
              <input class="input" type="number" formControlName="grade" min="1" max="12" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="label">Müəllim adı</label><input class="input" formControlName="teacherFirstName" /></div>
              <div><label class="label">Müəllim soyadı</label><input class="input" formControlName="teacherLastName" /></div>
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
export class SubjectsComponent {
  private service = inject(SubjectService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private exporter = inject(ExportService);
  private auth = inject(AuthService);

  isAdmin = this.auth.hasRole('Admin');

  items = signal<Subject[]>([]);
  page = signal(1);
  pageSize = 10;
  totalCount = signal(0);
  totalPages = signal(1);
  search = signal('');
  loading = signal(true);

  modalOpen = signal(false);
  saving = signal(false);
  editing = signal<string | null>(null);
  private searchTimer?: ReturnType<typeof setTimeout>;

  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{3}$/)]],
    name: ['', [Validators.required, Validators.maxLength(30)]],
    grade: [9, [Validators.required, Validators.min(1), Validators.max(12)]],
    teacherFirstName: ['', [Validators.required, Validators.maxLength(20)]],
    teacherLastName: ['', [Validators.required, Validators.maxLength(20)]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list({ page: this.page(), pageSize: this.pageSize, search: this.search(), sortBy: 'code' }).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page.set(1);
      this.load();
    }, 350);
  }

  goPage(p: number): void {
    this.page.set(p);
    this.load();
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ code: '', name: '', grade: 9, teacherFirstName: '', teacherLastName: '' });
    this.form.controls.code.enable();
    this.modalOpen.set(true);
  }

  openEdit(s: Subject): void {
    this.editing.set(s.code);
    this.form.reset({ code: s.code, name: s.name, grade: s.grade, teacherFirstName: s.teacherFirstName, teacherLastName: s.teacherLastName });
    this.form.controls.code.disable();
    this.modalOpen.set(true);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    const code = this.editing();
    const request = code
      ? this.service.update(code, { name: v.name, grade: v.grade, teacherFirstName: v.teacherFirstName, teacherLastName: v.teacherLastName })
      : this.service.create(v);

    request.subscribe({
      next: () => {
        this.toast.success(code ? 'Fənn yeniləndi.' : 'Fənn əlavə edildi.');
        this.modalOpen.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  async remove(s: Subject): Promise<void> {
    const ok = await this.confirm.ask(`'${s.name}' fənnini silmək istədiyinizə əminsiniz?`);
    if (!ok) return;
    this.service.remove(s.code).subscribe({
      next: () => {
        this.toast.success('Fənn silindi.');
        this.load();
      },
    });
  }

  exportExcel(): void {
    const rows = this.items().map((s) => ({ Kod: s.code, Ad: s.name, Sinif: s.grade, Müəllim: `${s.teacherFirstName} ${s.teacherLastName}`, İmtahan: s.examCount }));
    this.exporter.toExcel(rows, 'fenler', 'Fənlər');
  }

  exportPdf(): void {
    const body = this.items().map((s) => [s.code, s.name, s.grade, `${s.teacherFirstName} ${s.teacherLastName}`, s.examCount]);
    this.exporter.toPdf('Fənlər', ['Kod', 'Ad', 'Sinif', 'Müəllim', 'İmtahan'], body, 'fenler');
  }
}
