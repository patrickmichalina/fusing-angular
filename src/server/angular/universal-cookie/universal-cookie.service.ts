import { Injectable } from '@angular/core'

export const coerce = (str: string) => {
  if (str.toLowerCase() === 'undefined') return undefined
  if (str.toLowerCase() === 'null') return null
  if (str.toLowerCase() === 'true') return true
  if (str.toLowerCase() === 'false') return false
  const maybeInt = parseInt(str)

  if (!isNaN(maybeInt)) return maybeInt

  try {
    return JSON.parse(decodeURIComponent(str))
  } catch (err) {
    return str
  }
}

export const parseCookieString = (str = '') => str
  .split(';')
  .map(a => a.trimLeft())
  .filter(a => a && a !== '')
  .map(a => a.split('='))
  .reduce((acc, curr) => ({ ...acc, [curr[0]]: coerce(curr[1]) }), {})

@Injectable()
export class UniversalCookieService {

}
