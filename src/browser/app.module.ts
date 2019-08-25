import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './shared/shared.module'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { PreserveQueryParamsDirective, RouterLinkLangDirective } from './param-router-link.directive'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { UniversalCookieModule } from '../server/angular/universal-cookie/universal-cookie.module'
import { HttpClient } from '@angular/common/http'
import { EnvironmentService } from './shared/environment.service'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private es: EnvironmentService) { }

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`static/i18n/${lang}.json?v=${this.es.config.APP_VERSION}`).pipe(
      catchError(_err => of({}),
    ))
  }
}

@NgModule({
  declarations: [AppComponent, PreserveQueryParamsDirective, RouterLinkLangDirective],
  imports: [
    AppRoutingModule,
    NotFoundModule,
    SharedModule,
    TranslateModule,
    UniversalCookieModule,
    FloNodeEnvTransferModule.config({
      useValues: {
        APP_VERSION: "__APPVERSION__" // to sync server/web version to the electron version. Otherwise recommend using Node Environment variable.
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
        deps: [HttpClient, EnvironmentService]
      }
    }),
    BrowserModule.withServerTransition({ appId: 'pm-app' })
  ]
})
export class AppModule { }