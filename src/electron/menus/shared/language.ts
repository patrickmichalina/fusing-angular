import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { promises } from 'fs'
import { from } from 'rxjs'
import { maybe } from 'typescript-monads'
import { sendAngularMessage } from '../../util'
import { window$ } from '../../app'
import { take, filter } from 'rxjs/operators'

type StringDict = { readonly [key: string]: string }
type Interem = { key: string, language: string }

// to enable a menu to appear in the Electron app, add your key/value entry here
// as long as the file exists in the /i18n folder it will work!
const supportedLanguages: StringDict = {
  'en': 'English',
  'jp': 'Japanese'
}

const LANGUAGE_MENU_ID = 'lang-menu'

export default function getUsableLanguageMenu() {
  return from(promises
    .readdir(join(app.getAppPath(), '/wwwroot/assets/i18n'))
    .then(convertTranslatonFilePath(supportedLanguages))
    .then(mapMenuItem)
    .then(mapMenu))
}

const mapMenu = (submenu: any[]) => ({ submenu, label: 'Language', id: LANGUAGE_MENU_ID })
const mapMenuItem = (i: Interem[]) => i.map(b => {
  return {
    type: 'checkbox',
    id: b.key,
    label: b.language,
    enabled: true,
    visible: true,
    checked: b.key === 'en' ? true : false,
    click: setLangauge(b.key)
  }
})

const convertTranslatonFilePath =
  (langMap: StringDict) =>
    (paths: string[]) =>
      paths
        .map(path => path.split('.')[0])
        .filter((el, i, a) => i === a.indexOf(el))
        .map<Interem>(key => ({ key, language: langMap[key] }))

const setLangauge = (lang: string) => () => {
  maybe(app.applicationMenu)
    .flatMapAuto(a => a.items.find(a => a.id === LANGUAGE_MENU_ID))
    .map(a => a.submenu.items)
    .tapSome(items => {
      items.forEach(i => i.checked = false)
      maybe(items.find(b => b.id === lang)).tapSome(b => {
        window$.pipe(filter(Boolean), take(1)).subscribe((a: BrowserWindow) => {
          sendAngularMessage(a, 'change-language', lang)
        })
        b.checked = true
      })
    })
}

