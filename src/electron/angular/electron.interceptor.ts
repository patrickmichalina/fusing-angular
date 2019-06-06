import { Observable } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { ENV } from '@flosportsinc/ng-env-transfer-state'

@Injectable()
export class HttpElectronInterceptor implements HttpInterceptor {
  constructor(@Inject(ENV) private _env: any) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.url.includes('http')
      ? next.handle(req)
      : req.url.includes('./')
        ? next.handle(req.clone({ url: `${req.url.replace('./', '')}` }))
        : next.handle(req.clone({ url: `${this._env.SERVER_HOST}/${req.url}` }))
  }
}
