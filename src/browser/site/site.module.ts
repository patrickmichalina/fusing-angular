import { NgModule } from '@angular/core'
import { SiteComponent } from './site.component'
import { SharedSiteModule } from './shared/shared.module'
import { SiteRoutingModule } from './site-routing.module'

@NgModule({
  declarations: [SiteComponent],
  imports: [
    SiteRoutingModule,
    SharedSiteModule
  ],
  exports: [
    SiteRoutingModule,
    SharedSiteModule
  ]
})
export class SiteModule { }