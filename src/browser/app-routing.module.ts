import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomeModule } from './home/home.module'
import { lazyRoutes } from './app-routing.lazy'
import { AboutModule } from './about/about.module'
import { APP_BASE_HREF } from '@angular/common'

@NgModule({
  imports: [
    HomeModule,
    AboutModule,
    // <-- Non-lazy modules go here.
    RouterModule.forRoot(lazyRoutes, { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
