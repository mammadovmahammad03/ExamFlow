import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-80 flex-col gap-2">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-soft backdrop-blur"
          [class]="styles(t.type)"
        >
          <span class="mt-0.5 text-lg leading-none">{{ icon(t.type) }}</span>
          <p class="flex-1 text-sm font-medium">{{ t.message }}</p>
          <button class="text-sm opacity-60 hover:opacity-100" (click)="toast.dismiss(t.id)">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toast = inject(ToastService);

  styles(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200';
      default:
        return 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-100';
    }
  }

  icon(type: ToastType): string {
    return type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ';
  }
}
