import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'

export const setChromiumFlags = () => reader<IElectronConfig, void>(cfg => {
  const log = cfg.LOGGER.child({ ns: 'setChromiumFlags()' })
  log.trace('Entered function "setChromiumFlags()"')
})
