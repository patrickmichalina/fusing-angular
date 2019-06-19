import { NgModule } from '@angular/core'
import { COOKIES, COOKIES_STRING } from './token'
import { parseCookieString } from './universal-cookie.service'

export function cookieFactory(cookieString?: string) {
  const lambda = parseCookieString(cookieString)
  return lambda
}

@NgModule({
  providers: [
    { provide: COOKIES_STRING, useValue: undefined },
    { provide: COOKIES, useFactory: cookieFactory, deps: [COOKIES_STRING] }
  ]
})
export class UniversalCookieModule {
}