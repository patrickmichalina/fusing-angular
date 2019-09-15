import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { FloNodeEnvTransferServerModule, } from '@flosportsinc/ng-env-transfer-state/server'
import { FloHttpCacheTagExpressServerModule } from '@flosportsinc/ng-http-cache-tags'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'
import { SiteModule } from '../../browser/site/site.module'
import { SiteComponent } from '../../browser/site/site.component'

enableProdMode()

@NgModule({
  imports: [
    SiteModule,
    ServerModule,
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
  bootstrap: [SiteComponent],
})
export class AppServerModule {
}