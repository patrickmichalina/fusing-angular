import { Menu, BrowserWindow } from "electron"
import { macMainMenuTemplate } from "./mac/mac"
import { forkJoin, Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { getUsableLanguageMenu } from "./shared/language"
import { reader } from "typescript-monads"
import { IElectronConfig } from "../config"

export const initMenu = (win: BrowserWindow) => reader<IElectronConfig, Observable<any>>(cfg => forkJoin(
  getUsableLanguageMenu(win).run(cfg),
)
.pipe(
  tap(resolvedMenus => {
    const languageMenu = resolvedMenus[0]
    const menu = Menu.buildFromTemplate([macMainMenuTemplate, languageMenu as any])
    Menu.setApplicationMenu(menu)
  })
))
