import { PartialOptions, IRequiredBrowserOptions, IRequiredUniversalServerOptions, IRequiredElectronOptions, Options } from "./interfaces"

export const mergeOptions =
  (defaultsOptions: Options) =>
    (incomingOptions: PartialOptions): Options => ({
      ...defaultsOptions,
      ...incomingOptions,
      browser: {
        ...defaultsOptions.browser,
        ...incomingOptions.browser as IRequiredBrowserOptions,
        bundle: {
          ...defaultsOptions.browser.bundle,
          ...((incomingOptions.browser || {})).bundle
        }
      },
      universal: {
        ...defaultsOptions.universal,
        ...incomingOptions.universal as IRequiredUniversalServerOptions,
        bundle: {
          ...defaultsOptions.universal.bundle,
          ...((incomingOptions.universal || {})).bundle
        }
      },
      electron: {
        ...defaultsOptions.electron,
        ...incomingOptions.electron as IRequiredElectronOptions,
        bundle: {
          ...defaultsOptions.electron.bundle,
          ...((incomingOptions.electron || {})).bundle
        }
      },
      optimizations: {
        ...defaultsOptions.optimizations,
        ...incomingOptions.optimizations
      }
    })

export const removeUndefinedValuesFromObj = (ob: any) =>
  Object.keys(ob)
    .reduce((acc, curr): any => {
      return typeof ob[curr] === 'undefined'
        ? acc
        : {
          ...acc,
          [curr]: typeof ob[curr] === 'object'
            ? removeUndefinedValuesFromObj(ob[curr])
            : ob[curr]
        }
    }, {})