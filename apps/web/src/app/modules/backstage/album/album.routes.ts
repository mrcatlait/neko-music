import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages').then((c) => c.AlbumManagementPage),
  },
  {
    path: 'create/single',
    loadComponent: () => import('./pages').then((c) => c.AlbumSingleCreatePage),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages').then((c) => c.AlbumCreateKindPage),
  },
]
