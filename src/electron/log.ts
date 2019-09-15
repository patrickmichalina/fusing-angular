import { Logger } from 'pino'
import { app } from 'electron'
import { createWriteStream } from 'fs'
const pinoms = require('pino-multi-stream')

export const initLogger = (isDev = false) => {
  app.setAppLogsPath()
  const logBasePath = app.getPath('logs')

  const fileOutStream = (title: string) => createWriteStream(`${logBasePath}/${app.name}.${title}.log`, { flags: 'a' })

  const devlogs = isDev ? [
    { level: 'trace', stream: pinoms.prettyStream() },
    { level: 'trace', stream: fileOutStream('trace') }
  ] : []

  const lg: Logger = pinoms({
    streams: [
      ...devlogs,
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
