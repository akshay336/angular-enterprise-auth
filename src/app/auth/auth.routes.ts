import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In - Omni-Bridge Solutions'
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Create Account - Omni-Bridge Solutions'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Reset Password Request - Omni-Bridge Solutions'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Update Password - Omni-Bridge Solutions'
  },
  {
    path: 'verify-mfa',
    loadComponent: () => import('./pages/verify-mfa/verify-mfa.component').then(m => m.VerifyMfaComponent),
    title: 'Two-Factor Authentication - Omni-Bridge Solutions'
  }
];
