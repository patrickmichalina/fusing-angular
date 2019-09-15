import { NgModule } from '@angular/core'
import { SiteComponent } from './site.component'
import { SiteRoutingModule } from './site-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [SiteComponent],
  imports: [
    SiteRoutingModule,
    SharedModule,
    BrowserModule.withServerTransition({ appId: 'pm-app' })
  ]
})
export class SiteModule { }