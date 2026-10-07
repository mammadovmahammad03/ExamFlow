import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../shared/confirm.service';
import { ExportService } from '../../core/services/export.service';
import { PaginationComponent } from '../../shared/pagination.component';
import { Student } from '../../core/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, PaginationComponent],
  template: `
    <div class="mx-auto max-w-6xl space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Şagirdlər</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Şagirdlərin idarə edilməsi</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary" (click)="exportExcel()">⬇ Excel</button>
          <button class="btn-secondary" (click)="exportPdf()">⬇ PDF</button>
          @if (isAdmin) { <button class="btn-primary" (click)="openCreate()">+ Yeni şagird</button> }
        </div>
      </div>

      <div class="card p-4">
        <input class="input max-w-xs" placeholder="🔍 Axtar (ad, soyad, nömrə)" [ngModel]="search()" (ngModelChange)="onSearch($event)" />
      </div>

      <div class="table-wrap">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Nömrə</th><th class="th">Ad</th><th class="th">Soyad</th>
              <th class="th">Sinif</th><th class="th">İmtahan</th>
              @if (isAdmin) { <th class="th text-right">Əməliyyat</th> }
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="isAdmin ? 6 : 5">Yüklənir...</td></tr>
            } @else if (items().length === 0) {
              <tr><td class="td text-center text-slate-400" [attr.colspan]="isAdmin ? 6 : 5">Nəticə tapılmadı</td></tr>
            } @else {
              @for (s of items(); track s.number) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="td font-mono font-semibold text-brand-600">{{ s.number }}</td>
                  <td class="td font-medium">{{ s.firstName }}</td>
                  <td class="td">{{ s.lastName }}</td>
                  <td class="td">{{ s.grade }}</td>
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
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ editing() ? 'Şagirdi redaktə et' : 'Yeni şagird' }}</h3>
          <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="save()">
            <div>
              <label class="label">Nömrə</label>
              <input class="input" type="number" formControlName="number" placeholder="10001" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="label">Ad</label><input class="input" formControlName="firstName" /></div>
              <div><label class="label">Soyad</label><input class="input" formControlName="lastName" /></div>
            </div>
            <div>
              <label class="label">Sinif</label>
              <input class="input" type="number" formControlName="grade" min="1" max="12" />
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
export class StudentsComponent {
  private service = inject(StudentService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private exporter = inject(ExportService);
  private auth = inject(AuthService);

  isAdmin = this.auth.hasRole('Admin');

  items = signal<Student[]>([]);
  page = signal(1);
  pageSize = 10;
  totalCount = signal(0);
  totalPages = signal(1);
  search = signal('');
  loading = signal(true);

  modalOpen = signal(false);
  saving = signal(false);
  editing = signal<number | null>(null);
  private searchTimer?: ReturnType<typeof setTimeout>;

  form = this.fb.nonNullable.group({
    number: [0, [Validators.required, Validators.min(1), Validators.max(99999)]],
    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    grade: [9, [Validators.required, Validators.min(1), Validators.max(12)]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list({ page: this.page(), pageSize: this.pageSize, search: this.search(), sortBy: 'number' }).subscribe({
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
    this.form.reset({ number: 0, firstName: '', lastName: '', grade: 9 });
    this.form.controls.number.enable();
    this.modalOpen.set(true);
  }

  openEdit(s: Student): void {
    this.editing.set(s.number);
    this.form.reset({ number: s.number, firstName: s.firstName, lastName: s.lastName, grade: s.grade });
    this.form.controls.number.disable();
    this.modalOpen.set(true);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    const number = this.editing();
    const request = number
      ? this.service.update(number, { firstName: v.firstName, lastName: v.lastName, grade: v.grade })
      : this.service.create(v);

    request.subscribe({
      next: () => {
        this.toast.success(number ? 'Şagird yeniləndi.' : 'Şagird əlavə edildi.');
        this.modalOpen.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  async remove(s: Student): Promise<void> {
    const ok = await this.confirm.ask(`'${s.firstName} ${s.lastName}' şagirdini silmək istədiyinizə əminsiniz?`);
    if (!ok) return;
    this.service.remove(s.number).subscribe({
      next: () => {
        this.toast.success('Şagird silindi.');
        this.load();
      },
    });
  }

  exportExcel(): void {
    const rows = this.items().map((s) => ({ Nömrə: s.number, Ad: s.firstName, Soyad: s.lastName, Sinif: s.grade, İmtahan: s.examCount }));
    this.exporter.toExcel(rows, 'sagirdler', 'Şagirdlər');
  }

  exportPdf(): void {
    const body = this.items().map((s) => [s.number, s.firstName, s.lastName, s.grade, s.examCount]);
    this.exporter.toPdf('Şagirdlər', ['Nömrə', 'Ad', 'Soyad', 'Sinif', 'İmtahan'], body, 'sagirdler');
  }
}
