import { Injectable, Inject, Renderer2 } from "@angular/core"
import { ElectronService } from "./electron.service"
import { TranslateService } from "@ngx-translate/core"
import { map, skip, pluck } from "rxjs/operators"
import { DOCUMENT } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { EnvironmentService } from "./environment.service"

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(private es: ElectronService, private ts: TranslateService, private ar: ActivatedRoute,
    private env: EnvironmentService, @Inject(DOCUMENT) private doc: HTMLDocument) {}

  init(rdr: Renderer2) {
    this.initDocMeta(rdr)
    this.initLanguages(rdr)
    this.es.sendMsgToElectron('app-loaded', true)
  }

  initDocMeta(rdr: Renderer2) {
    this.env.maybeGet('APP_VERSION').tapSome(ver => {
      rdr.setAttribute((this.doc as HTMLDocument).body, 'data-version', ver)
    })
  }

  initLanguages(rdr: Renderer2) {
    this.ts.onLangChange.pipe(map(a => a.lang)).subscribe(lang => rdr.setAttribute(this.doc.documentElement, 'lang', lang))
    
    this.es.electronMessage$('change-language').subscribe(a => this.ts.use(a))

    this.ts.setDefaultLang('en')
    this.ar.queryParams.pipe(skip(1), pluck('lang')).subscribe(lang => {
      if (lang) {
        this.ts.use(lang)
      } else {
        this.ts.use('en')
      }
    })
  }
}