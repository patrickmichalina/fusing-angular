import { maybe } from 'typescript-monads'
import { resolve } from 'path'

export interface StringDictionary {
  readonly [key: string]: string
}

export interface IConfig {
  readonly PORT: number
  readonly NODE_DEBUG: boolean
  readonly CLUSTERED_WORKERS: number
  readonly DIST_FOLDER: string
  readonly WWW_ROOT: string
}

export const STANDARD_CONFIG: IConfig = {
  NODE_DEBUG: maybe(process.env.NODE_ENV).filter(a => a === 'production').isNone(),
  PORT: maybe(process.env.PORT).map(p => +p).valueOr(4201),
  CLUSTERED_WORKERS: maybe(process.env.WEB_CONCURRENCY).map(a => +a).valueOr(1),
  DIST_FOLDER: resolve('dist'),
  WWW_ROOT: 'wwwroot'
}
