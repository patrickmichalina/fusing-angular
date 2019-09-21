import { NgModule } from '@angular/core'
import { SiteComponent } from './site.component'
import { SiteRoutingModule } from './site-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from '../shared/shared.module'
import { SharedSiteModule } from './shared/shared.module'
import { ServiceWorkerModule } from '@angular/service-worker'

@NgModule({
  declarations: [SiteComponent],
  imports: [
    SiteRoutingModule,
    SharedModule,
    SharedSiteModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: process.env.pwa === "true" }),
    BrowserModule.withServerTransition({ appId: 'pm-site' })
  ]
})
export class SiteModule { }