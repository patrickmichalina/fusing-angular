import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomeModule } from './home/home.module'
import { lazyRoutes } from './app-routing.lazy'
import { AboutModule } from './about/about.module'
import { getBaseRef, getLocationStrategy } from './app-routing.electron'
import { APP_BASE_HREF, PlatformLocation, LocationStrategy } from '@angular/common'

@NgModule({
  imports: [
    HomeModule,
    AboutModule,
    // <-- Non-lazy modules go here.
    RouterModule.forRoot(lazyRoutes, { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: getBaseRef },
    { provide: LocationStrategy, useFactory: getLocationStrategy, deps: [PlatformLocation, APP_BASE_HREF] }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
