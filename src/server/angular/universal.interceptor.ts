import { Observable } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { REQUEST } from '@nguniversal/express-engine/tokens'

@Injectable()
export class HttpUniversalInterceptor implements HttpInterceptor {
  constructor(@Inject(REQUEST) private req: any) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.url.includes('http')
      ? next.handle(req)
      : next.handle(req.clone({
        url: `${(req.headers as any)['x-forwarded-proto'] || this.req.protocol}://${this.req.get('host')}/${req.url.replace(/^\/+/, '')}`
      }))
  }
}
