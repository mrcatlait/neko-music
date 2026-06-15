import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./import-list/import-list').then((c) => c.ImportList),
  },
  {
    path: 'new',
    loadComponent: () => import('./import-wizard/import-wizard').then((c) => c.ImportWizard),
  },
  {
    path: 'started',
    loadComponent: () => import('./shared/components/import-started/import-started').then((c) => c.ImportStarted),
  },
  {
    path: ':importId',
    loadComponent: () => import('./import-details/import-details').then((c) => c.ImportDetails),
  },
]
