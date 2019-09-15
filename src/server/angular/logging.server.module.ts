import { NgModule } from '@angular/core'
import { LOGGING_CLIENT, LOGGING_LEVEL } from '../../browser/shared/fusing/logging/logging.tokens'
import { LoggingModule } from '../../browser/shared/fusing/logging/logging.module'
import { EnvironmentService } from '../../browser/shared/fusing/environment.service'
import * as pino from 'pino'

export function serverClient(level: string, es: EnvironmentService) {
  const lambda = pino({ level }).child({ platform: 'server', ver: es.config.APP_VERSION })
  return lambda
}

@NgModule({
  imports: [
    LoggingModule
  ],
  providers: [
    { provide: LOGGING_CLIENT, useFactory: serverClient, deps: [LOGGING_LEVEL, EnvironmentService] }
  ]
})
export class LoggingServerModule { }