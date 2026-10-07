import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Role } from '../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 p-4">
      <div class="w-full max-w-md">
        <div class="mb-6 text-center text-white">
          <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">🎓</div>
          <h1 class="text-3xl font-extrabold">ExamFlow</h1>
          <p class="mt-1 text-brand-200">Yeni hesab yaradın</p>
        </div>

        <div class="card p-7">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">Qeydiyyat</h2>

          <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
            <div>
              <label class="label">Email</label>
              <input class="input" type="email" formControlName="email" placeholder="ad@examflow.local" />
            </div>
            <div>
              <label class="label">Şifrə</label>
              <input class="input" type="password" formControlName="password" placeholder="Ən azı 6 simvol" />
            </div>
            <div>
              <label class="label">Rol</label>
              <select class="input" formControlName="role">
                <option value="Student">Şagird</option>
                <option value="Teacher">Müəllim</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button class="btn-primary w-full py-2.5" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Yaradılır...' : 'Qeydiyyatdan keç' }}
            </button>
          </form>

          <p class="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Artıq hesabınız var?
            <a routerLink="/login" class="font-semibold text-brand-600 hover:underline dark:text-brand-300">Daxil ol</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Student' as Role, [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password, role } = this.form.getRawValue();
    this.auth.register(email, password, role).subscribe({
      next: () => {
        this.toast.success('Qeydiyyat uğurlu oldu. İndi daxil ola bilərsiniz.');
        this.router.navigate(['/login']);
      },
      error: () => this.loading.set(false),
    });
  }
}
