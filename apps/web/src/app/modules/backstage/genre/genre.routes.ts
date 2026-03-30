import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./genre-list').then((c) => c.GenreList),
  },
  {
    path: 'new',
    loadComponent: () => import('./genre-editor').then((c) => c.GenreEditor),
  },
  {
    path: ':genreId',
    loadComponent: () => import('./genre-editor').then((c) => c.GenreEditor),
  },
]
