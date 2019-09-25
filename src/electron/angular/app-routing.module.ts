import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HashLocationStrategy, PlatformLocation, APP_BASE_HREF, LocationStrategy } from '@angular/common'
import { AppComponent } from '../../browser/app/app.component'
import { appChildren } from '../../browser/app/app-routing.module'

export function getLocationStrategy(pl: PlatformLocation, baseHref: string) {
  return new HashLocationStrategy(pl, baseHref)
}

@NgModule({
  imports: [
    RouterModule.forRoot(appChildren)
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '' },
    { provide: LocationStrategy, useFactory: getLocationStrategy, deps: [PlatformLocation, APP_BASE_HREF] }
  ],
  exports: [RouterModule]
})
export class ElectronRoutingModule { }
