import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { Role } from '../core/models';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        class="fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <div class="flex h-16 items-center gap-2 border-b border-slate-100 px-5 dark:border-slate-800">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">🎓</div>
          <span class="text-lg font-bold text-slate-800 dark:text-white">ExamFlow</span>
        </div>
        <nav class="flex flex-col gap-1 p-3">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              (click)="closeOnMobile()"
            >
              <span class="text-lg">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-30 bg-slate-900/40 md:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <div class="flex min-h-screen flex-1 flex-col md:pl-64">
        <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
          <button class="btn-ghost p-2 md:hidden" (click)="sidebarOpen.set(!sidebarOpen())">☰</button>
          <div class="flex-1"></div>
          <div class="flex items-center gap-3">
            <button class="btn-ghost p-2" (click)="theme.toggle()" title="Tema">
              {{ theme.isDark() ? '☀️' : '🌙' }}
            </button>
            <div class="hidden text-right sm:block">
              <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ user()?.email }}</div>
              <span class="badge bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">{{ user()?.role }}</span>
            </div>
            <button class="btn-secondary px-3 py-1.5" (click)="auth.logout()">Çıxış</button>
          </div>
        </header>

        <main class="flex-1 p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);

  sidebarOpen = signal(false);
  user = this.auth.currentUser;

  private readonly allItems: NavItem[] = [
    { label: 'İdarə paneli', path: '/dashboard', icon: '📊', roles: ['Admin', 'Teacher'] },
    { label: 'Fənlər', path: '/subjects', icon: '📚', roles: ['Admin', 'Teacher', 'Student'] },
    { label: 'Şagirdlər', path: '/students', icon: '🧑‍🎓', roles: ['Admin', 'Teacher'] },
    { label: 'İmtahanlar', path: '/exams', icon: '📝', roles: ['Admin', 'Teacher', 'Student'] },
    { label: 'Hesabatlar', path: '/reports', icon: '📈', roles: ['Admin', 'Teacher'] },
  ];

  navItems = computed(() => {
    const role = this.user()?.role;
    return role ? this.allItems.filter((i) => i.roles.includes(role)) : [];
  });

  closeOnMobile(): void {
    if (window.innerWidth < 768) this.sidebarOpen.set(false);
  }
}
