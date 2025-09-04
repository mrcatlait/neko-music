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
  // {
  //   path: ':id/edit',
  //   loadComponent: () => import('./pages/artist-edit-page').then(c => c.ArtistEditPage)
  // },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./pages/artist-detail-page').then(c => c.ArtistDetailPage)
  // }
]
