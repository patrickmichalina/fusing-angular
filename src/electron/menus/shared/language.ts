import { app } from 'electron'
import { join } from 'path'
import { promises } from 'fs'

type StringDict = { readonly [key: string]: string }
type interm = { key: string, language: string }

// to enable a menu to appear in the Electron app, add your key/value entry here
// as long as the file exists in the /i18n folder it will work!
const langMap: StringDict = {
  'en': 'English',
  'jp': 'Japanese'
}

export default function tester() {
  return promises
    .readdir(join(app.getAppPath(), 'dist/electron/public/i18n'))
    .then(convertTranslatonFilePath(langMap))
    .then(mapMenuItem)
    .then(mapMenu)
}

const mapMenu = (submenu: any[]) => ({ submenu, label: 'Language' })
const mapMenuItem = (i: interm[]) => i.map(b => {
  return {
    label: b.language,
    enabled: true,
    checked: true,
    visible: true,
    click: setLangauge(b.key)
  }
})

const convertTranslatonFilePath =
  (langMap: StringDict) =>
    (paths: string[]) =>
      paths
        .map(path => path.split('.')[0])
        .map<interm>(key => ({ key, language: langMap[key] }))

const setLangauge = (lang: string) => () => {
  console.log('TODO: setting language to', lang)
}

