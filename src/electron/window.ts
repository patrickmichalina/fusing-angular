import { join } from 'path'
import { format } from 'url'
import { app, BrowserWindow } from 'electron'
import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'

export const initWindow = () => reader<IElectronConfig, BrowserWindow>(cfg => {
  const win = new BrowserWindow({
    center: true,
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    },
  })

  // and load the index.html of the app.
  win.loadURL(
    format({
      pathname: cfg.PATH_TO_WEBPAGE_INDEX,
      protocol: 'file:',
      slashes: true,
    })
  )

  if (cfg.IS_DEVELOPMENT) {
    win.webContents.openDevTools() // Open the DevTools.
  } else {
    // TODO PROD ONLY SETUP
  }

  return win
})



