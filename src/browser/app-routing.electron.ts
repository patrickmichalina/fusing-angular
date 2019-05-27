export function isElectron() {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron') ? true : false
}

export function getBaseRef() {
  return isElectron() ? '' : '/'
}
