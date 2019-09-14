import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomeModule } from './home/home.module'
import { lazyRoutes } from './app-routing.lazy'
import { APP_BASE_HREF } from '@angular/common'

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot(lazyRoutes, { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
