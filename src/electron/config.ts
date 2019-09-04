import { maybe } from 'typescript-monads'
import { join } from 'path'
import { app } from 'electron'
import { StringDict } from './interfaces'
import { initLogger } from './log'
import * as pino from 'pino'

export interface IElectronConfig {
  readonly PATH_TO_PUBLIC_FOLDER: string
  readonly PATH_TO_ASSETS_FOLDER: string
  readonly PATH_TO_TRANSLATIONS_FOLDER: string
  readonly PATH_TO_WEBPAGE_INDEX: string
  readonly IS_DEVELOPMENT: boolean
  readonly IS_PLATFORM_OSX: boolean
  readonly IS_PLATFORM_WINDOWS: boolean
  readonly IS_PLATFORM_LINUX: boolean
  readonly SUPPORTED_LANGUAGES: StringDict
  readonly LOGGER: pino.Logger
  readonly LOGGER_RDR: pino.Logger
}

const IS_DEVELOPMENT = maybe(process.mainModule).filter(a => a.filename.includes('app.asar')).isNone()
const BASE = app.getAppPath().includes('dist/desktop') ? app.getAppPath() : app.getAppPath() + '/dist/desktop'
const PATH_TO_PUBLIC_FOLDER = join(BASE, 'wwwroot')
const PATH_TO_ASSETS_FOLDER = join(PATH_TO_PUBLIC_FOLDER, 'assets')
const loggers = initLogger(IS_DEVELOPMENT)
const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'jp': 'Japanese'
}

export const ELECTRON_CONFIG: IElectronConfig = {
  IS_DEVELOPMENT,
  IS_PLATFORM_OSX: process.platform === 'darwin',
  IS_PLATFORM_WINDOWS: process.platform === 'win32',
  IS_PLATFORM_LINUX: process.platform === 'linux',
  SUPPORTED_LANGUAGES,
  PATH_TO_PUBLIC_FOLDER,
  PATH_TO_ASSETS_FOLDER,
  PATH_TO_WEBPAGE_INDEX: join(PATH_TO_PUBLIC_FOLDER, 'index.html'),
  PATH_TO_TRANSLATIONS_FOLDER: join(PATH_TO_ASSETS_FOLDER, 'i18n'),
  LOGGER: loggers.main,
  LOGGER_RDR: loggers.rdr,
}
