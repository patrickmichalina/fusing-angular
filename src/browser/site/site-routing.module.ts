import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { lazyRoutes } from './site-routing.lazy'
import { APP_BASE_HREF } from '@angular/common'

@NgModule({
  imports: [
    RouterModule.forRoot(lazyRoutes, { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
