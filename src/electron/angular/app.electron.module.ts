import { NgModule } from '@angular/core'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { AppComponent } from '../../browser/app/app.component'
import { ENV_CONFIG_DEFAULT } from '@flosportsinc/ng-env-transfer-state'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpElectronInterceptor } from './electron.interceptor'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ElectronRoutingModule } from './app-routing.module'
import { EnvironmentService } from '../../browser/shared/fusing/environment.service'
import { ElectronService } from '../../browser/shared/fusing/electron.service'
import { ElectronServerService } from './electron.service'
import { AppBrowserModule } from '../../browser/app/app.browser.module'

export function createTranslateLoader(http: HttpClient, es: EnvironmentService) {
  return new TranslateHttpLoader(http, './assets/i18n/', `.json?v=${es.config.APP_VERSION}`)
}

export function maybeGetElectronVars() {
  return Object.keys(process.env)
    .filter(a => a.includes('NG_'))
    .reduce((acc, curr) => ({ ...acc, [curr.replace('NG_', '')]: process.env[curr] }), {})
}

@NgModule({
  imports: [
    AppBrowserModule,
    FloNodeEnvTransferBrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, EnvironmentService]
      }
    }),
    ElectronRoutingModule
  ],
  providers: [
    HttpElectronInterceptor,
    { provide: ENV_CONFIG_DEFAULT, useFactory: maybeGetElectronVars },
    { provide: HTTP_INTERCEPTORS, useExisting: HttpElectronInterceptor, multi: true },
    { provide: ElectronService, useClass: ElectronServerService }
  ],
  bootstrap: [AppComponent]
})
export class AppElectronModule { }