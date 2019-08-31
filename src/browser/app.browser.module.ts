import { NgModule } from '@angular/core'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    AppModule,
    FloNodeEnvTransferBrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: true })
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }