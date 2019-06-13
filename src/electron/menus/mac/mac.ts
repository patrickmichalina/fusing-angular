import { MenuItem, app } from 'electron'

export const macMainMenuTemplate = {
  label: app.getName(),
  submenu: [
    { label: `About ${app.getName()}` },
    { type: 'separator' },
    { label: 'Quit' }
  ] as MenuItem[]
}