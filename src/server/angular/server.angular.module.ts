import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppComponent } from '../../browser/app.component'
import { AppModule } from '../../browser/app.module'
import { FloNodeEnvTransferServerModule, } from '@flosportsinc/ng-env-transfer-state/server'
import { FloHttpCacheTagExpressServerModule } from '@flosportsinc/ng-http-cache-tags'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { EnvironmentService } from '../../browser/shared/environment.service'
import { UniversalCookieServerModule } from './universal-cookie/universal-cookie.server.module'

export function createTranslateLoader(http: HttpClient, es: EnvironmentService) {
  return new TranslateHttpLoader(http, 'i18n/', `.json?v=${es.config.APP_VERSION}`)
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, EnvironmentService]
      }
    })
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