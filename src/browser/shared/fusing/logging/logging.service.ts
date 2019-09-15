import { Injectable, Inject } from "@angular/core"
import { LOGGING_CLIENT, LOGGING_LEVEL } from "./logging.tokens"
import * as pino from 'pino'

export interface ILoggingService {
  readonly trace: (msg: string, ...args: any[]) => void
  readonly info: (msg: string, ...args: any[]) => void
  readonly warn: (msg: string, ...args: any[]) => void
  readonly error: (msg: string, ...args: any[]) => void
  readonly fatal: (msg: string, ...args: any[]) => void
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService implements ILoggingService {
  constructor(@Inject(LOGGING_CLIENT) private loggingClient: pino.Logger, @Inject(LOGGING_LEVEL) logLevel: string) {
    this.loggingClient.level = logLevel
   }

  public readonly trace = this.loggingClient.trace.bind(this.loggingClient)
  public readonly info = this.loggingClient.info.bind(this.loggingClient)
  public readonly warn = this.loggingClient.warn.bind(this.loggingClient)
  public readonly error = this.loggingClient.error.bind(this.loggingClient)
  public readonly fatal = this.loggingClient.fatal.bind(this.loggingClient)
}