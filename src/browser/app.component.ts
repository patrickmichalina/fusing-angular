import { Component, ChangeDetectionStrategy, Inject, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { ActivatedRoute } from '@angular/router'
import { skip, pluck, startWith, map } from 'rxjs/operators'
import { COOKIES } from '../server/angular/universal-cookie/token'
import { exampleDecorator } from './shared/decorators/example.decorator'
import { EnvironmentService } from './shared/fusing/environment.service'
import { ElectronService } from './shared/fusing/electron.service'
import { merge } from 'rxjs';

@Component({
  selector: 'pm-app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private _doc: any, private _rd: Renderer2, ts: TranslateService, ar: ActivatedRoute,
    private env: EnvironmentService, @Inject(COOKIES) cookies: any, es: ElectronService, @Inject(DOCUMENT) doc: any,
    rdr: Renderer2) {

    ts.onLangChange.pipe(map(a => a.lang)).subscribe(lang => {
      rdr.setAttribute(doc.documentElement, 'lang', lang)
    })
    es.sendMsgToElectron('app-loaded', true)
    es.electronMessage$('change-language').subscribe(lang => {
      ts.use(lang)
    })

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

  @exampleDecorator()
  ngOnInit() {
    this.env.maybeGet('APP_VERSION').tapSome(ver => {
      this._rd.setAttribute((this._doc as HTMLDocument).body, 'data-version', ver)
    })
  }
}
