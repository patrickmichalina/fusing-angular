import { Menu } from "electron"
import { macMainMenuTemplate } from "./mac/mac"
import { forkJoin } from "rxjs"
import { tap } from "rxjs/operators"
import getUsableLanguageMenu from "./shared/language"

export const menu$ = forkJoin(
  getUsableLanguageMenu(),
)
.pipe(
  tap(resolvedMenus => {
    const languageMenu = resolvedMenus[0]
    const menu = Menu.buildFromTemplate([macMainMenuTemplate, languageMenu as any])
    Menu.setApplicationMenu(menu)
  })
)
