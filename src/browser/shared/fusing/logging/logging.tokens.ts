import { InjectionToken } from '@angular/core'
import * as pino from 'pino'

export const LOGGING_LEVEL = new InjectionToken<string>('vg.logging.level')
export const LOGGING_CLIENT = new InjectionToken<pino.Logger>('vg.logging.client')
