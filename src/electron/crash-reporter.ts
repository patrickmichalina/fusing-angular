import { crashReporter } from 'electron'
import { IElectronConfig } from './config'
import { reader } from 'typescript-monads'

export const initCrashReporter = () => reader<IElectronConfig, void>(cfg => {
  return crashReporter.start({
    companyName: 'FusingAngular',
    submitURL: 'https://your-domain.com/url-to-submit',
    uploadToServer: false
  })
})

