import { Menu } from "electron"
import { macMainMenuTemplate } from "./mac/mac"
import { forkJoin } from "rxjs"
import getUsableLanguageMenu from "./shared/language"
import { tap } from "rxjs/operators"

export const menu$ = forkJoin(
  getUsableLanguageMenu(),
)
.pipe(
  tap(a => {
    const menu = Menu.buildFromTemplate([macMainMenuTemplate, a[0] as any])
    Menu.setApplicationMenu(menu)
  })
)
