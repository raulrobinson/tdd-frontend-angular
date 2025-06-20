import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    loadComponent: () =>
      import('./pages/todo.component')
        .then(m => m.TodoComponent),
  },
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full',
  },
];
