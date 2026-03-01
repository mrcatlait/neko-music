import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages').then((c) => c.GenresManagementPage),
  },
]
