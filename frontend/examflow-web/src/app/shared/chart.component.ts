import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div class="relative h-64"><canvas #cv></canvas></div>`,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  type = input.required<ChartType>();
  labels = input.required<string[]>();
  data = input.required<number[]>();
  label = input<string>('');

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private chart?: Chart;
  private ready = false;

  constructor() {
    effect(() => {
      this.labels();
      this.data();
      this.type();
      if (this.ready) this.render();
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private palette = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

  private render(): void {
    this.chart?.destroy();
    const type = this.type();
    const isCircular = type === 'doughnut' || type === 'pie';

    this.chart = new Chart(this.canvas().nativeElement, {
      type,
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: this.label(),
            data: this.data(),
            backgroundColor: isCircular ? this.palette : this.palette[0] + 'cc',
            borderColor: isCircular ? '#ffffff' : this.palette[0],
            borderWidth: isCircular ? 2 : 0,
            borderRadius: isCircular ? 0 : 6,
            tension: 0.35,
            fill: type === 'line',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: isCircular, labels: { color: '#94a3b8' } },
        },
        scales: isCircular
          ? {}
          : {
              x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
              y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,.15)' }, beginAtZero: true },
            },
      },
    });
  }
}
