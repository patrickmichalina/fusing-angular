import { NgModule } from '@angular/core'
import { LoggingService } from './logging.service'
import { LOGGING_LEVEL } from './logging.tokens'
import { EnvironmentService } from '../environment.service'

export function levelFactory(es: EnvironmentService) {
  return es.maybeGetAsBoolean('NODE_DEBUG')
    .filter(Boolean)
    .match({
      none: () => 'info',
      some: _ => 'trace'
    })
}

@NgModule({
  providers: [
    LoggingService,
    { provide: LOGGING_LEVEL, useFactory: levelFactory, deps: [EnvironmentService] }
  ]
})
export class LoggingModule { }