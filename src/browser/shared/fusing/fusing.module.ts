import { NgModule } from '@angular/core'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { UniversalCookieModule } from '../../../server/angular/universal-cookie/universal-cookie.module'
import { PlatformService } from './platform.service'
import { ElectronService } from './electron.service'
import { EnvironmentService } from './environment.service'

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private es: EnvironmentService) { }

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`assets/i18n/${lang}.json?v=${this.es.config.APP_VERSION}`).pipe(
      catchError(_err => of({}),
    ))
  }
}

@NgModule({
  imports: [
    UniversalCookieModule,
    FloNodeEnvTransferModule.config({
      useValues: (global as any).FuseBox.processEnv
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
        deps: [HttpClient, EnvironmentService]
      }
    })
  ],
  exports: [
    UniversalCookieModule,
    FloNodeEnvTransferModule,
    TranslateModule
  ],
  providers: [
    PlatformService,
    EnvironmentService,
    ElectronService
  ]
})
export class FusingModule { }