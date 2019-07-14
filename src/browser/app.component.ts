import { Component, ChangeDetectionStrategy, Inject, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { ActivatedRoute } from '@angular/router'
import { skip, pluck } from 'rxjs/operators'
import { EnvironmentService } from './shared/environment.service'
import { COOKIES } from '../server/angular/universal-cookie/token'
import { ElectronService } from './shared/electron.service'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private _doc: any, private _rd: Renderer2, ts: TranslateService, ar: ActivatedRoute,
    private env: EnvironmentService, @Inject(COOKIES) cookies: any, es: ElectronService) {

    es.sendMsgToElectron('app-loaded', true)

    ts.setDefaultLang('en')
    ar.queryParams.pipe(skip(1), pluck('lang')).subscribe(lang => {
      if (lang) {
        ts.use(lang)
      } else {
        ts.use('en')
      }
    })
  }
  public param = { value: 'John' }
  public en = { lang: 'en' }
  public jp = { lang: 'jp' }

  ngOnInit() {
    this.env.maybeGet('APP_VERSION').tapSome(ver => {
      this._rd.setAttribute((this._doc as HTMLDocument).body, 'data-version', ver)
    })
  }
}
