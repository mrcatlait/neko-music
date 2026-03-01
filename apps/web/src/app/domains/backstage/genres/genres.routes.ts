import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages').then((c) => c.GenresManagementPage),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages').then((c) => c.GenreCreationPage),
  },
]
