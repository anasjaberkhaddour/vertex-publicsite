import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing/landing').then(m => m.Landing)
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/layout/layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/users').then(m => m.AdminUsers)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/admin/roles/roles').then(m => m.AdminRoles)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile/profile').then(m => m.AdminProfile)
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/admin/messages/messages').then(m => m.AdminMessages)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];