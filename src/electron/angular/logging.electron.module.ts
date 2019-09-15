import { NgModule } from '@angular/core'
import { LOGGING_CLIENT, LOGGING_LEVEL } from '../../browser/shared/fusing/logging/logging.tokens'
import { LoggingModule } from '../../browser/shared/fusing/logging/logging.module'
import { EnvironmentService } from '../../browser/shared/fusing/environment.service'
import { ElectronService } from '../../browser/shared/fusing/electron.service'
import * as pino from 'pino'

export function levelFactory(es: EnvironmentService) {
  return es.config.NODE_DEBUG === 'true' ? 'trace' : 'info'
}

type ConsoleT = 'warn' | 'info' | 'trace' | 'debug' | 'error' | 'log'

export function electronClient(level: string, es: ElectronService) {
  const emit = (type: string) => (cns: ConsoleT) => (o: any) => {
    console[cns](o)
    es.sendMsgToElectron('log', { type, msg: o.msg })
  }
  const lambda = pino({
    level,
    browser: {
      asObject: true,
      write: {
        trace: emit('trace')('log'),
        info: emit('info')('info'),
        debug: emit('debug')('debug'),
        warn: emit('warn')('warn'),
        error: emit('debug')('error'),
        fatal: emit('fatal')('error'),
      }
    }
  }).child({ platform: 'renderer' })
  return lambda
}

@NgModule({
  imports: [
    LoggingModule
  ],
  providers: [
    { provide: LOGGING_LEVEL, useFactory: levelFactory, deps: [EnvironmentService] },
    { provide: LOGGING_CLIENT, useFactory: electronClient, deps: [LOGGING_LEVEL, ElectronService] }
  ]
})
export class LoggingElectronModule { }