import { Observable, of } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpEventType } from '@angular/common/http'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { catchError, tap, distinctUntilChanged } from 'rxjs/operators'

@Injectable()
export class HttpUniversalInterceptor implements HttpInterceptor {
  constructor(@Inject(REQUEST) private req: any) { }

  prev?: string

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`${(req.headers as any)['x-forwarded-proto'] || this.req.protocol}://${this.req.get('host')}/${req.url}`)
    
    return req.url.includes('http')
      ? next.handle(req)
      : next.handle(req.clone({
        url: `${(req.headers as any)['x-forwarded-proto'] || this.req.protocol}://${this.req.get('host')}/${req.url}`
      }))
  }
}
