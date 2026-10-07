import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { DashboardSummary } from '../../core/models';
import { ChartComponent } from '../../shared/chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, DecimalPipe],
  template: `
    <div class="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İdarə paneli</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">İmtahan statistikasına ümumi baxış</p>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="card h-24 animate-pulse bg-slate-100 dark:bg-slate-800"></div>
          }
        </div>
      } @else if (data(); as d) {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div class="card p-5"><div class="text-xs font-semibold uppercase text-slate-400">Fənlər</div><div class="mt-1 text-3xl font-extrabold text-brand-600">{{ d.subjects }}</div></div>
          <div class="card p-5"><div class="text-xs font-semibold uppercase text-slate-400">Şagirdlər</div><div class="mt-1 text-3xl font-extrabold text-brand-600">{{ d.students }}</div></div>
          <div class="card p-5"><div class="text-xs font-semibold uppercase text-slate-400">İmtahanlar</div><div class="mt-1 text-3xl font-extrabold text-brand-600">{{ d.exams }}</div></div>
          <div class="card p-5"><div class="text-xs font-semibold uppercase text-slate-400">Orta qiymət</div><div class="mt-1 text-3xl font-extrabold text-accent-600">{{ d.averageGrade }}</div></div>
          <div class="card p-5"><div class="text-xs font-semibold uppercase text-slate-400">Keçmə faizi</div><div class="mt-1 text-3xl font-extrabold text-emerald-600">{{ (d.passRate * 100) | number:'1.0-0' }}%</div></div>
        </div>

        @if (d.exams === 0) {
          <div class="card p-10 text-center text-slate-500 dark:text-slate-400">
            <div class="text-4xl">📭</div>
            <p class="mt-2">Hələ imtahan nəticəsi yoxdur. Qrafiklər məlumat əlavə edildikdə görünəcək.</p>
          </div>
        } @else {
          <div class="grid gap-6 lg:grid-cols-2">
            <div class="card p-5">
              <h3 class="mb-4 font-semibold text-slate-700 dark:text-slate-200">Fənn üzrə orta qiymət</h3>
              <app-chart type="bar" [labels]="subjectLabels()" [data]="subjectData()" label="Orta qiymət" />
            </div>
            <div class="card p-5">
              <h3 class="mb-4 font-semibold text-slate-700 dark:text-slate-200">Qiymət paylanması</h3>
              <app-chart type="doughnut" [labels]="gradeLabels()" [data]="gradeData()" label="Say" />
            </div>
            <div class="card p-5 lg:col-span-2">
              <h3 class="mb-4 font-semibold text-slate-700 dark:text-slate-200">Sinif üzrə performans</h3>
              <app-chart type="bar" [labels]="classLabels()" [data]="classData()" label="Orta qiymət" />
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class DashboardComponent {
  private reports = inject(ReportService);

  data = signal<DashboardSummary | null>(null);
  loading = signal(true);

  subjectLabels = computed(() => this.data()?.subjectAverages.map((s) => s.subjectCode) ?? []);
  subjectData = computed(() => this.data()?.subjectAverages.map((s) => s.averageGrade) ?? []);
  gradeLabels = computed(() => this.data()?.gradeDistribution.map((g) => 'Qiymət ' + g.grade) ?? []);
  gradeData = computed(() => this.data()?.gradeDistribution.map((g) => g.count) ?? []);
  classLabels = computed(() => this.data()?.classPerformance.map((c) => c.grade + '-ci sinif') ?? []);
  classData = computed(() => this.data()?.classPerformance.map((c) => c.averageGrade) ?? []);

  constructor() {
    this.reports.dashboard().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
