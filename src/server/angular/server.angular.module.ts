import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppComponent } from '../../browser/app.component'
import { AppModule } from '../../browser/app.module'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpUniversalInterceptor } from './universal.interceptor'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json')
}

enableProdMode()

@NgModule({
  imports: [
    ServerModule,
    ServerTransferStateModule,
    NodeEnvTransferServerModule.config({
      selectKeys: ['HEROKU_RELEASE_VERSION', 'HEROKU_SLUG_COMMIT']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
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