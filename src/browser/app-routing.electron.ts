import { HashLocationStrategy, PlatformLocation, PathLocationStrategy } from '@angular/common'

const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_ELECTRON = HAS_NAVIGATOR && navigator.userAgent.includes('Electron') ? true : false

export function getBaseRef() {
  return HAS_NAVIGATOR && navigator.userAgent.includes('Electron') ? '' : '/'
}

export function getLocationStrategy(pl: PlatformLocation, baseHref: string) {
  return IS_ELECTRON
    ? new HashLocationStrategy(pl, baseHref)
    : new PathLocationStrategy(pl, baseHref)
}
