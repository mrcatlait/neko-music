import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./artist-list').then((c) => c.ArtistList),
  },
  {
    path: 'create',
    loadComponent: () => import('./artist-editor').then((c) => c.ArtistEditor),
  },
  {
    path: ':id',
    loadComponent: () => import('./artist-editor').then((c) => c.ArtistEditor),
  },
]
