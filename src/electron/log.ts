// Trace - Only when I would be "tracing" the code and trying to find one part of a function specifically.
// Debug - Information that is diagnostically helpful to people more than just developers (IT, sysadmins, etc.).
// Info - Generally useful information to log (service start/stop, configuration assumptions, etc). Info I want to always have available but usually don't care about under normal circumstances. This is my out-of-the-box config level.
// Warn - Anything that can potentially cause application oddities, but for which I am automatically recovering. (Such as switching from a primary to backup server, retrying an operation, missing secondary data, etc.)
// Error - Any error which is fatal to the operation, but not the service or application (can't open a required file, missing data, etc.). These errors will force user (administrator, or direct user) intervention. These are usually reserved (in my apps) for incorrect connection strings, missing services, etc.
// Fatal - Any error that is forcing a shutdown of the service or application to prevent data loss (or further data loss). I reserve these only for the most heinous errors and situations where there is guaranteed to have been data corruption or loss.

import { Logger } from 'pino'
import { app } from 'electron'
import { createWriteStream } from 'fs'
const pinoms = require('pino-multi-stream')

export const initLogger = (isDev = false) => {
  app.setAppLogsPath()
  const logBasePath = app.getPath('logs')

  const fileOutStream = (title: string) => createWriteStream(`${logBasePath}/${app.name}.${title}.log`, { flags: 'a' })

  const lg: Logger = pinoms({
    streams: [
      ...(!isDev ? [] : [
        { level: 'trace', stream: pinoms.prettyStream() },
        { level: 'trace', stream: fileOutStream('trace') }
      ]),
      { level: 'info', stream: fileOutStream('info') },
      { level: 'warn', stream: fileOutStream('warn') },
      { level: 'error', stream: fileOutStream('error') },
      { level: 'fatal', stream: fileOutStream('fatal') }
    ]
  }) as Logger

  const master = lg.child({ ver: app.getVersion() })
  const main = master.child({ platform: 'electron-main' })
  const rdr = master.child({ platform: 'electron-renderer' })
  
  const thisLogger = main.child({ ns: 'initLogger()' })
  thisLogger.info('Logging Started!')
  thisLogger.info(`Logs storage directory set to: ${logBasePath}`)
  thisLogger.info('Development logging enabled:', isDev)

  return {
    main,
    rdr
  }
}
