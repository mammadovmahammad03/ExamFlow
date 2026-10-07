import { Component, inject } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (confirm.state(); as s) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div class="card w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ s.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ s.message }}</p>
          <div class="mt-6 flex justify-end gap-3">
            <button class="btn-secondary" (click)="confirm.answer(false)">Ləğv et</button>
            <button [class]="s.danger ? 'btn-danger' : 'btn-primary'" (click)="confirm.answer(true)">
              {{ s.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  confirm = inject(ConfirmService);
}
