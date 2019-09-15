import { NgModule } from '@angular/core'
import { ServiceWorkerModule } from '@angular/service-worker'
import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'
import { SharedBrowserModule } from '../shared/shared.browser.module'

@NgModule({
  imports: [
    SiteModule,
    SharedBrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: true })
  ],
  bootstrap: [SiteComponent]
})
export class SiteBrowserModule { }