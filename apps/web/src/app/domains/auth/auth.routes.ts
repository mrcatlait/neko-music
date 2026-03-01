import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login-page').then((c) => c.LoginPage) },
  {
    path: 'registration',
    loadComponent: () => import('./pages/register/registration-page').then((c) => c.RegistrationPage),
  },
]

// https://www.angular.courses/blog/angular-folder-structure-guide