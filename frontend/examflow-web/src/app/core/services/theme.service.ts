import { Injectable, signal } from '@angular/core';
import { THEME_KEY } from '../config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.load());

  constructor() {
    this.apply(this.isDark());
  }

  toggle(): void {
    this.isDark.update((v) => !v);
    const dark = this.isDark();
    this.apply(dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }

  private load(): boolean {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored === 'dark';
    } catch {
      // ignore
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
