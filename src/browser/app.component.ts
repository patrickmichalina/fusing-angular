import { Component, ChangeDetectionStrategy, Inject, Renderer2 } from '@angular/core'
import { ENV } from '@flosportsinc/ng-env-transfer-state'
import { maybe } from 'typescript-monads'
import { DOCUMENT } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { ActivatedRoute } from '@angular/router'
import { skip, pluck } from 'rxjs/operators'

interface AppVersion {
  readonly ngIf: boolean
  readonly inline?: string
  readonly ver?: string
  readonly sha?: string
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(@Inject(ENV) private _env: any, @Inject(DOCUMENT) private _doc: any, private _rd: Renderer2,
    _translate: TranslateService, ar: ActivatedRoute) {
    _translate.setDefaultLang('en')

    ar.queryParams.pipe(skip(1), pluck('lang')).subscribe(lang => {
      if (lang) {
        _translate.use(lang)
      } else {
        _translate.use('en')
      }
    })
  }
  public param = { value: 'John' }
  public en = { lang: 'en' }
  public jp = { ang: 'jp' }
  private version = maybe(this._env.HEROKU_RELEASE_VERSION)
  private commit = maybe(this._env.HEROKU_SLUG_COMMIT)
  public appv = this.version
    .flatMap(ver => this.commit
      .map(sha => ({ ver, sha })))
    .map<AppVersion>(r => ({ ngIf: true, ...r, inline: `${r.ver} - ${r.sha}` }))
    .valueOr({ ngIf: false })

  ngOnInit() {
    this.appv.ver && this._rd.setAttribute((this._doc as HTMLDocument).body, 'data-version', this.appv.ver)
    this.appv.sha && this._rd.setAttribute((this._doc as HTMLDocument).body, 'data-commit', this.appv.sha)
  }
}