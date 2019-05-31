import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppComponent } from '../browser/app.component'
import { AppModule } from '../browser/app.module'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'

enableProdMode()

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    NodeEnvTransferServerModule.config({
      selectKeys: ['HEROKU_RELEASE_VERSION', 'HEROKU_SLUG_COMMIT']
    })
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}