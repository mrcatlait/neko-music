import { Routes } from '@angular/router'

import { canActivateAuthorized, canActivateGuest } from './core/guards'

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuthorized],
    loadComponent: () => import('./routes/(app)/app-layout').then((c) => c.AppLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./routes/(app)/home-page').then((c) => c.HomePage),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [canActivateGuest],
    loadComponent: () => import('./routes/(auth)/auth-layout').then((c) => c.AuthLayout),
    children: [
      { path: 'login', loadComponent: () => import('./routes/(auth)/login-page/login-page').then((c) => c.LoginPage) },
      {
        path: 'registration',
        loadComponent: () =>
          import('./routes/(auth)/registration-page/registration-page').then((c) => c.RegistrationPage),
      },
    ],
  },
  {
    path: '404',
    pathMatch: 'full',
    loadComponent: () => import('./routes/error-page').then((c) => c.ErrorPage),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
]
