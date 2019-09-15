import { Menu, BrowserWindow } from "electron"
import { macMainMenuTemplate } from "./mac/mac"
import { forkJoin, Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { getUsableLanguageMenu } from "./shared/language"
import { reader } from "typescript-monads"
import { IElectronConfig } from "../config"
import { editMenu } from "./shared/edit"
import { devMenu } from "./shared/dev"

export const initMenu = (win: BrowserWindow) => reader<IElectronConfig, Observable<any>>(cfg => forkJoin(
  getUsableLanguageMenu(win).run(cfg),
)
.pipe(
  tap(resolvedMenus => {
    const languageMenu = resolvedMenus[0]
    const menu = Menu.buildFromTemplate([
      macMainMenuTemplate, 
      editMenu(cfg.IS_PLATFORM_OSX), 
      languageMenu as any, 
      ...cfg.IS_DEVELOPMENT ? [devMenu(cfg)] : []
    ])
    Menu.setApplicationMenu(menu)
  })
))
