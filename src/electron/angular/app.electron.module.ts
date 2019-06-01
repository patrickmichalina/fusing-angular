
import { NgModule } from '@angular/core'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { AppModule } from '../../browser/app.module'
import { AppComponent } from '../../browser/app.component'
import { ENV_CONFIG_DEFAULT } from '@flosportsinc/ng-env-transfer-state'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpElectronInterceptor } from './electron.interceptor'

export function maybeGetElectronVars() {
  return Object.keys(process.env)
    .filter(a => a.includes('NG_'))
    .reduce((acc, curr) => ({ ...acc, [curr.replace('NG_', '')]: process.env[curr] }), {})
}

@NgModule({
  imports: [
    AppModule,
    NodeEnvTransferBrowserModule
  ],
  providers: [
    {
      provide: ENV_CONFIG_DEFAULT,
      useFactory: maybeGetElectronVars
    },
    HttpElectronInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpElectronInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppElectronModule { }