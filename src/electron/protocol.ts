import { protocol } from 'electron'
import { join, normalize } from 'path'
import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'

export const initInterceptFileProtocol = reader<IElectronConfig, void>(cfg => {
  const log = cfg.LOGGER.child({ function: 'initInterceptFileProtocol' })
  log.trace('Entered function')

  const PROTOCOL = 'file';

  log.trace('setting interceptFileProtocol')
  protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    // strip protocol
    let url = request.url.substr(PROTOCOL.length + 1);

    if (request.url.includes('/assets/') || request.url.includes('index.html')) {
      // build complete path for node require function
      url = join(cfg.PATH_TO_PUBLIC_FOLDER, url);
    }

    // replace backslashes by forward slashes (windows)
    url = normalize(url.replace(/\\/g, '/'))

    // remove hash from angular route
    url = url.split('#')[0]

    callback(url)
  })
})

