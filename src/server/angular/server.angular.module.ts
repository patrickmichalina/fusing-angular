import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppComponent } from '../../browser/app.component'
import { AppModule } from '../../browser/app.module'
import { FloNodeEnvTransferServerModule, } from '@flosportsinc/ng-env-transfer-state/server'
import { FloHttpCacheTagExpressServerModule } from '@flosportsinc/ng-http-cache-tags'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'
import { UniversalCookieServerModule } from './universal-cookie/universal-cookie.server.module'

enableProdMode()

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    FloHttpCacheTagExpressServerModule,
    UniversalCookieServerModule,
    FloNodeEnvTransferServerModule.config({
      selectKeys: ['HEROKU_RELEASE_VERSION', 'HEROKU_SLUG_COMMIT']
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpUniversalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}