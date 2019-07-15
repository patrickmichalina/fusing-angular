import { app } from 'electron'

export const macMainMenuTemplate = {
  label: app.getName(),
  submenu: [
    { label: `About ${app.getName()}`, role: 'about' },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]
}