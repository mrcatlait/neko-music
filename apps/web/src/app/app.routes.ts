import { Routes } from '@angular/router'

import { authorizedGuard, guestGuard } from '@/core/auth/guards'

export const routes: Routes = [
  {
    path: '',
    canActivate: [authorizedGuard],
    loadComponent: () => import('./modules/catalog/catalog-layout').then((c) => c.CatalogLayout),
    loadChildren: () => import('./modules/catalog/catalog.routes').then((c) => c.routes),
  },
  {
    path: 'backstage',
    canActivate: [authorizedGuard],
    loadComponent: () => import('./modules/backstage/backstage-layout').then((c) => c.BackstageLayout),
    loadChildren: () => import('./modules/backstage/backstage.routes').then((c) => c.routes),
  },
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./core/auth/auth-layout').then((c) => c.AuthLayout),
    loadChildren: () => import('./core/auth/auth.routes').then((c) => c.routes),
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
