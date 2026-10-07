import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  const token = auth.getToken();
  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        toast.error('Serverə qoşulmaq mümkün olmadı.');
      } else if (err.status === 401) {
        if (auth.isAuthenticated()) {
          toast.error('Sessiya bitdi, yenidən daxil olun.');
          auth.logout();
        } else {
          toast.error('Email və ya şifrə yanlışdır.');
        }
      } else if (err.status === 403) {
        toast.error('Bu əməliyyat üçün icazəniz yoxdur.');
      } else {
        toast.error(err.error?.message ?? 'Xəta baş verdi.');
      }
      return throwError(() => err);
    }),
  );
};
