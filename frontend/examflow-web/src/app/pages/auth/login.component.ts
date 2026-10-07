import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 p-4">
      <div class="w-full max-w-md">
        <div class="mb-6 text-center text-white">
          <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">🎓</div>
          <h1 class="text-3xl font-extrabold">ExamFlow</h1>
          <p class="mt-1 text-brand-200">İmtahan Nəticələri İdarəetmə Sistemi</p>
        </div>

        <div class="card p-7">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">Daxil ol</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Hesabınıza daxil olun</p>

          <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
            <div>
              <label class="label">Email</label>
              <input class="input" type="email" formControlName="email" placeholder="admin@examflow.local" />
            </div>
            <div>
              <label class="label">Şifrə</label>
              <input class="input" type="password" formControlName="password" placeholder="••••••••" />
            </div>
            <button class="btn-primary w-full py-2.5" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Daxil olunur...' : 'Daxil ol' }}
            </button>
          </form>

          <p class="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Hesabınız yoxdur?
            <a routerLink="/register" class="font-semibold text-brand-600 hover:underline dark:text-brand-300">Qeydiyyatdan keç</a>
          </p>

          <div class="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span class="font-semibold">Demo:</span> admin&#64;examflow.local / Admin123!
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.toast.success('Uğurla daxil oldunuz.');
        const target = res.user.role === 'Student' ? '/subjects' : '/dashboard';
        this.router.navigate([target]);
      },
      error: () => this.loading.set(false),
    });
  }
}
