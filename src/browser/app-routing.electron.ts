import { HashLocationStrategy, PlatformLocation, PathLocationStrategy } from '@angular/common'

const IS_ELECTRON = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron') ? true : false

export function getBaseRef() {
  return navigator.userAgent.includes('Electron') ? '' : '/'
}

export function getLocationStrategy(pl: PlatformLocation, baseHref: string) {
  return IS_ELECTRON
    ? new HashLocationStrategy(pl, baseHref)
    : new PathLocationStrategy(pl, baseHref)
}
