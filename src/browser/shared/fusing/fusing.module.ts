import { NgModule } from '@angular/core'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { PlatformService } from './platform.service'
import { ElectronService } from './electron.service'
import { EnvironmentService } from './environment.service'
import { AppInitService } from './app-init.service'
import { PreserveQueryParamsDirective, RouterLinkLangDirective } from './param-router-link.directive'
import { LoggingModule } from './logging/logging.module'
import { UpdaterModule } from './updater/updater.module'

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private es: EnvironmentService) { }

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`/assets/i18n/${lang}.json?v=${this.es.config.APP_VERSION}`).pipe(
      catchError(_err => of({}),
      ))
  }
}

@NgModule({
  imports: [
    UpdaterModule,
    LoggingModule,
    FloNodeEnvTransferModule.config({
      useValues: { APP_VERSION: "__APP_VERSION__" }
    })
  ],
  declarations: [
    PreserveQueryParamsDirective,
    RouterLinkLangDirective
  ],
  exports: [
    UpdaterModule,
    LoggingModule,
    PreserveQueryParamsDirective,
    RouterLinkLangDirective,
    FloNodeEnvTransferModule,
    TranslateModule
  ],
  providers: [
    PlatformService,
    EnvironmentService,
    ElectronService,
    AppInitService
  ]
})
export class FusingModule { }