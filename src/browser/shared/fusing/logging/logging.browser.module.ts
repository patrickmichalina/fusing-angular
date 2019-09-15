import { NgModule } from '@angular/core'
import { LOGGING_CLIENT, LOGGING_LEVEL } from './logging.tokens'
import { LoggingModule } from './logging.module'
import { EnvironmentService } from '../environment.service'
import * as pino from 'pino'

export function browserClient(level: string, es: EnvironmentService) {
  const lambda = pino({
    level,
    browser: {
      asObject: true,
      write: {
        trace: console.log,
        info: console.info,
        debug: console.debug,
        warn: console.warn,
        error: console.error,
        fatal: console.error
      }
    }
  }).child({ platform: 'browser', ver: es.config.APP_VERSION })
  return lambda
}

@NgModule({
  imports: [
    LoggingModule
  ],
  providers: [
    { provide: LOGGING_CLIENT, useFactory: browserClient, deps: [LOGGING_LEVEL, EnvironmentService] }
  ]
})
export class LoggingBrowserModule { }