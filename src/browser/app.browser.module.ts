import { NgModule } from '@angular/core'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { EnvironmentService } from './shared/environment.service'
import { UniversalCookieBrowserModule } from '../server/angular/universal-cookie/universal-cookie.browser.module'

export function createTranslateLoader(http: HttpClient, es: EnvironmentService) {
  return new TranslateHttpLoader(http, 'i18n/', `.json?v=${es.config.APP_VERSION}`)
}

@NgModule({
  imports: [
    AppModule,
    FloNodeEnvTransferBrowserModule,
    UniversalCookieBrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, EnvironmentService]
      }
    }),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: true })
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }