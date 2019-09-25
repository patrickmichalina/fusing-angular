import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'

const routes = [
  { path: 'app', loadChildren: () => import('./app/app.module').then(m => m.AppModule) },
  { path: '', loadChildren: () => import('./site/site.module').then(m => m.SiteModule) }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      initialNavigation: 'enabled', 
      scrollPositionRestoration: 'enabled', 
      anchorScrolling: 'enabled' 
    })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [RouterModule]
})
export class RootRoutingModule { }
