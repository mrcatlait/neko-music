import { Routes } from '@angular/router'

import { canActivateAuthorized, canActivateGuest } from './core/guards'
import { catalogRoutes } from './routes/(admin)/catalog/catalog.routes'

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuthorized],
    loadComponent: () => import('./routes/(app)/app-layout').then((c) => c.AppLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./routes/(app)/home-page').then((c) => c.HomePage),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [canActivateAuthorized],
    loadComponent: () => import('./routes/(admin)/admin-layout').then((c) => c.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./routes/(admin)/overview-page').then((c) => c.OverviewPage),
        pathMatch: 'full',
      },
      {
        path: 'catalog',
        loadChildren: () => import('./routes/(admin)/catalog/catalog.routes').then((c) => c.catalogRoutes),
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
