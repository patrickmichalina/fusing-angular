import { NgModule } from '@angular/core'
import { SiteComponent } from './site.component'
import { SiteRoutingModule } from './site-routing.module'
// import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [SiteComponent],
  imports: [
    SharedModule,
    SiteRoutingModule,
    // NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
  ]
})
export class SiteModule { }