import { NgModule } from '@angular/core'
import { ServiceWorkerModule } from '@angular/service-worker'
import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    SiteModule,
    FloNodeEnvTransferBrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: true })
  ],
  bootstrap: [SiteComponent]
})
export class SiteBrowserModule { }