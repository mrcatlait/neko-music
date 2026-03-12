import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages').then((c) => c.ArtistsManagementPage),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages').then((c) => c.ArtistCreatePage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages').then((c) => c.ArtistDetailPage),
  },
]
