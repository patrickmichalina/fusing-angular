import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppComponent } from '../../browser/app.component'
import { AppModule } from '../../browser/app.module'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'

enableProdMode()

@NgModule({
  imports: [
    ServerModule,
    ServerTransferStateModule,
    NodeEnvTransferServerModule.config({
      selectKeys: ['HEROKU_RELEASE_VERSION', 'HEROKU_SLUG_COMMIT']
    }),
    AppModule
  ],
  providers: [
    HttpUniversalInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpUniversalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}