import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/guards';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Teacher'] },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'subjects',
        loadComponent: () => import('./pages/subjects/subjects.component').then((m) => m.SubjectsComponent),
      },
      {
        path: 'students',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Teacher'] },
        loadComponent: () => import('./pages/students/students.component').then((m) => m.StudentsComponent),
      },
      {
        path: 'exams',
        loadComponent: () => import('./pages/exams/exams.component').then((m) => m.ExamsComponent),
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Teacher'] },
        loadComponent: () => import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];
