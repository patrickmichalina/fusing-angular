import { Observable } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { REQUEST } from '@nguniversal/express-engine/tokens'

@Injectable()
export class HttpUniversalInterceptor implements HttpInterceptor {
  constructor(@Inject(REQUEST) private _req: any) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.url.includes('http')
      ? next.handle(req)
      : next.handle(req.clone({
        url: `${(req.headers as any)['x-forwarded-proto'] && process.env.NODE_ENV === 'production' ? 'https' : this._req.protocol}://${this._req.get('host')}/${req.url}`
      }))
  }
}
