import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { routes } from '../main-routing'
import { APP_BASE_HREF } from '@angular/common'

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
