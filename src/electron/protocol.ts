import { protocol } from 'electron'
import { join, normalize } from 'path'
import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'

export const initInterceptFileProtocol = reader<IElectronConfig, void>(cfg => {
  const PROTOCOL = 'file';
  
  protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    // Strip protocol
    let url = request.url.substr(PROTOCOL.length + 1);
  
    // Build complete path for node require function
    url = join(cfg.PATH_TO_PUBLIC_FOLDER, url);
  
    // Replace backslashes by forward slashes (windows)
    url = normalize(url.replace(/\\/g, '/'))
    url = url.split('#')[0]
    console.log(url);
    callback(url)
  })
})

