import { app, BrowserWindow } from 'electron'
import { promises } from 'fs'
import { from } from 'rxjs'
import { maybe, reader } from 'typescript-monads'
import { IElectronConfig } from '../../config'
import { StringDict } from '../../interfaces'
import { sendAngularMessage } from '../../util'
// import { take, filter } from 'rxjs/operators'
// import { window$ } from '../../app'

type Interem = { key: string, language: string }

const LANGUAGE_MENU_ID = 'lang-menu'

export const getUsableLanguageMenu = (win: BrowserWindow) => reader<IElectronConfig, any>(cfg => from(promises
  .readdir(cfg.PATH_TO_TRANSLATIONS_FOLDER)
  .then(convertTranslatonFilePath(cfg.SUPPORTED_LANGUAGES))
  .then(mapMenuItem(win))
  .then(mapMenu)))

const mapMenu = (submenu: any[]) => ({ submenu, label: 'Language', id: LANGUAGE_MENU_ID })
const mapMenuItem = (win: BrowserWindow) => (i: Interem[]) => i.map(b => {
  return {
    type: 'checkbox',
    id: b.key,
    label: b.language,
    enabled: true,
    visible: true,
    checked: b.key === 'en' ? true : false,
    click: setLangauge(win, b.key)
  }
})

const convertTranslatonFilePath =
  (langMap: StringDict) =>
    (paths: string[]) =>
      paths
        .map(path => path.split('.')[0])
        .filter((el, i, a) => i === a.indexOf(el))
        .map<Interem>(key => ({ key, language: langMap[key] }))

const setLangauge = (window: BrowserWindow, lang: string) => () => {
  maybe(app.applicationMenu)
    .flatMapAuto(a => a.items.find(a => a.id === LANGUAGE_MENU_ID))
    .flatMapAuto(a => a.submenu)
    .flatMapAuto(a => a.items)
    .tapSome(items => {
      items.forEach(i => i.checked = false)
      maybe(items.find(b => b.id === lang)).tapSome(b => {
        sendAngularMessage(window, 'change-language', lang)
        b.checked = true
      })
    })
}

