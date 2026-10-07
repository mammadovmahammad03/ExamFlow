import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="flex items-center justify-between gap-4 px-1 py-3 text-sm">
      <span class="text-slate-500 dark:text-slate-400">
        {{ totalCount() }} nəticə · Səhifə {{ page() }} / {{ displayPages() }}
      </span>
      <div class="flex gap-2">
        <button class="btn-secondary px-3 py-1.5" [disabled]="page() <= 1" (click)="go(page() - 1)">‹ Əvvəlki</button>
        <button class="btn-secondary px-3 py-1.5" [disabled]="page() >= totalPages()" (click)="go(page() + 1)">Növbəti ›</button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  page = input.required<number>();
  totalPages = input.required<number>();
  totalCount = input.required<number>();
  pageChange = output<number>();

  displayPages(): number {
    return this.totalPages() < 1 ? 1 : this.totalPages();
  }

  go(target: number): void {
    if (target >= 1 && target <= this.totalPages()) {
      this.pageChange.emit(target);
    }
  }
}
