import { NgModule } from '@angular/core'
import { COOKIES_STRING } from './token'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Request } from 'express'

export function cookieStringFactory(req: Request) {
  const lambda = req.headers.cookie
  return lambda
}

@NgModule({
  providers: [
    { provide: COOKIES_STRING, useFactory: cookieStringFactory, deps: [REQUEST] }
  ]
})
export class UniversalCookieServerModule {
}