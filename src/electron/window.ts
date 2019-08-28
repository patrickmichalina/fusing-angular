import { join } from 'path'
import { format } from 'url'
import { app, BrowserWindow } from 'electron'
import { isElectronDev } from './util'
import initAutoUpdater from './updater'

export const createWindow = () => {
  const win = new BrowserWindow({
    center: true,
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  initAutoUpdater(win)

  // and load the index.html of the app.
  win.loadURL(
    format({
      pathname: join(app.getAppPath(), '/wwwroot/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  )

  if (isElectronDev()) {
    win.webContents.openDevTools() // Open the DevTools.
  } else {
    // TODO PROD ONLY SETUP
  }

  return win
}



