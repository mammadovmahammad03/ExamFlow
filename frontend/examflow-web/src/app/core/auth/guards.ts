import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../services/toast.service';
import { Role } from '../models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as Role[] | undefined;
  if (!roles || auth.hasRole(...roles)) return true;

  toast.error('Bu səhifəyə girişiniz yoxdur.');
  router.navigate(['/subjects']);
  return false;
};
