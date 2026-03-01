import { Routes } from '@angular/router'

import { canActivateAuthorized, canActivateGuest } from './core/guards'

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuthorized],
    loadComponent: () => import('./layouts/main-layout').then((c) => c.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home-page').then((c) => c.HomePage),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'backstage',
    canActivate: [canActivateAuthorized],
    loadComponent: () => import('./layouts/admin-layout').then((c) => c.AdminLayout),
    loadChildren: () => import('./domains/backstage/backstage.routes').then((c) => c.routes),
  },
  {
    path: '',
    canActivate: [canActivateGuest],
    loadComponent: () => import('./layouts/auth-layout').then((c) => c.AuthLayout),
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login-page').then((c) => c.LoginPage) },
      {
        path: 'registration',
        loadComponent: () => import('./pages/auth/register/registration-page').then((c) => c.RegistrationPage),
      },
    ],
  },
  {
    path: '404',
    pathMatch: 'full',
    loadComponent: () => import('./pages/error/not-found/not-found-page').then((c) => c.NotFoundPage),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
]
