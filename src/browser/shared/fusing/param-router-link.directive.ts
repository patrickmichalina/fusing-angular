import { Directive, HostBinding, Input, HostListener } from "@angular/core"
import { RouterLinkWithHref, ActivatedRoute, Router, NavigationEnd } from "@angular/router"
import { pluck } from "rxjs/operators"
import { Location } from "@angular/common"
import { HttpParams } from "@angular/common/http"

// use until https://github.com/angular/angular/issues/12664#issue-186844950 is solved!
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[routerLink]'
})
export class PreserveQueryParamsDirective {
  constructor(private link: RouterLinkWithHref, private route: ActivatedRoute, loc: Location) {
    this.route.queryParams.pipe(pluck('lang')).subscribe(lang => {
      if (lang) {
        this.link.queryParams = { ...this.route.snapshot.queryParams, lang }
      } else {
        this.link.queryParams = { ...this.route.snapshot.queryParams }
      }
    })
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'a[routerLinkLang]'
})
export class RouterLinkLangDirective {
  constructor(private router: Router, private loc: Location, private route: ActivatedRoute) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.updateUrl()
      }
    })
  }

  @HostBinding('href') public href: string
  @Input('routerLinkLang') routerLinkLang: string

  constructUrl(lang?: string) {
    const path = this.loc.path()
    if (lang) {
      const split = path.split('?')
      const host = split[0]
      const fromString = split[1]

      if (lang === 'en') {
        const params = new HttpParams({ fromString }).delete('lang')
        const str = params.toString()
        return str ? `${host}?${params.toString()}` : host
      } else {
        const params = new HttpParams({ fromString }).set('lang', lang)
        return `${host}?${params.toString()}`
      }
    } else {
      return path
    }
  }

  updateUrl() {
    this.href = this.constructUrl(this.routerLinkLang)
  }

  @HostListener('click')
  public onClick(): boolean {
    this.router.navigateByUrl(this.href, { relativeTo: this.route })
    return false
  }

  ngOnInit() {
    this.updateUrl()
  }
}
