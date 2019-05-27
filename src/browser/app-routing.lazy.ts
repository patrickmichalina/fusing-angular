import { Routes } from '@angular/router';

export function aboutModule() {
  return import('./about/about.module').then(m => m.AboutModule)
}

export const lazyRoutes: Routes = [
  { path: 'about', loadChildren: aboutModule }
]
