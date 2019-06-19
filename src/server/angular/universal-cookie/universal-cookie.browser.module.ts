import { NgModule } from '@angular/core'
import { COOKIES_STRING } from './token'
import { DOCUMENT } from '@angular/common'

export function cookieStringFactory(doc: any) {
  const lambda = doc.cookie
  return lambda
}

@NgModule({
  providers: [
    { provide: COOKIES_STRING, useFactory: cookieStringFactory, deps: [DOCUMENT] }
  ]
})
export class UniversalCookieBrowserModule {
}