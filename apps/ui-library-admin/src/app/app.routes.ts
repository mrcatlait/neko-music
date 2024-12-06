import { Routes } from '@angular/router'

import { canActivateAuthorized, canActivateGuest } from '@core/guards'

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [canActivateAuthorized],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home').then((c) => c.HomePage),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivateChild: [canActivateGuest],
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./pages/login').then((c) => c.LoginPage),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
]
