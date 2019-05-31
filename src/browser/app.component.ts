import { Component, ChangeDetectionStrategy, Inject } from '@angular/core'
import { ENV } from '@flosportsinc/ng-env-transfer-state'
import { maybe } from 'typescript-monads'

const normalizeCss = `html{box-sizing:border-box}*,::after,::before{box-sizing:inherit}:root{-moz-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'}hr{height:0}abbr[title]{text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,Courier,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{padding:0}progress{vertical-align:baseline}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}`

@Component({
  selector: 'app-root',
  styles: [normalizeCss],
  template: `
    <div class="root">
    <h1 style="margin-bottom: 0px;">Fusing Angular</h1>
    <h3 style="margin-top: 0px;" *ngIf="h3.ngIf">({{ h3.value }})</h3>
    <ul>
      <li><a routerLink>Home</a></li>
      <li><a routerLink="/about">About</a></li>
    </ul>
    <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(@Inject(ENV) private _env: any) { }

  private version = maybe(this._env.HEROKU_RELEASE_VERSION)
  private commit = maybe(this._env.HEROKU_SLUG_COMMIT)
  public h3 = this.version
    .flatMap(ver => this.commit
      .map(sha => ({ ver, sha })))
    .map(r => ({ ngIf: true, value: `${r.ver} - ${r.sha}` }))
    .valueOr({ ngIf: false, value: '' })
}