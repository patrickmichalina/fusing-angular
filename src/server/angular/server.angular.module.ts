import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { FloNodeEnvTransferServerModule, } from '@flosportsinc/ng-env-transfer-state/server'
import { FloHttpCacheTagExpressServerModule } from '@flosportsinc/ng-http-cache-tags'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'
import { LoggingServerModule } from './logging.server.module'
import { RootModule } from '../../browser/root.module'
import { RootComponent } from '../../browser/root.component'

enableProdMode()

@NgModule({
  imports: [
    RootModule,
    ServerModule,
    LoggingServerModule,
    ServerTransferStateModule,
    FloHttpCacheTagExpressServerModule,
    FloNodeEnvTransferServerModule.config({
      selectKeys: ['HEROKU_RELEASE_VERSION', 'HEROKU_SLUG_COMMIT']
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpUniversalInterceptor,
      multi: true
    }
  ],
  bootstrap: [RootComponent],
})
export class AppServerModule {
}