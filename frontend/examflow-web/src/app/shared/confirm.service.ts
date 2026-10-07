import { Injectable, signal } from '@angular/core';

interface ConfirmState {
  title: string;
  message: string;
  confirmText: string;
  danger: boolean;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly state = signal<ConfirmState | null>(null);

  ask(message: string, options?: { title?: string; confirmText?: string; danger?: boolean }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.set({
        message,
        title: options?.title ?? 'Təsdiq edin',
        confirmText: options?.confirmText ?? 'Sil',
        danger: options?.danger ?? true,
        resolve,
      });
    });
  }

  answer(value: boolean): void {
    const current = this.state();
    if (current) {
      current.resolve(value);
      this.state.set(null);
    }
  }
}
