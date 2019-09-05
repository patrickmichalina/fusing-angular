import { app } from 'electron'

export const macMainMenuTemplate = {
  label: app.name,
  submenu: [
    { label: `About ${app.name}`, role: 'about' },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]
}