import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SiteComponent } from './site.component'

const children = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '**', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }
]

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SiteComponent, children }
    ]),
  ],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
