import { Http2ServerResponse, Http2ServerRequest } from "http2";
import { InjectionToken } from '@angular/core'

export const REQUEST = new InjectionToken<Http2ServerRequest>('REQUEST');
export const RESPONSE = new InjectionToken<Http2ServerResponse>('RESPONSE');
